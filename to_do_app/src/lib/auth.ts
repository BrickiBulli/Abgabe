import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcrypt";
import { db } from "./db";
import { NextApiRequest } from "next";

const pepper = process.env.PEPPER_SECRET || "";

// Rate limiting configuration
const RATE_LIMIT = {
  MAX_ATTEMPTS: 5,
  LOCKOUT_DURATION: 10 * 60 * 1000, // 10 minutes in milliseconds
};

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 10 * 60,
  },
  cookies: {
    // "sessionToken" is what NextAuth uses to store the JWT
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "strict", // or "strict" if you prefer
        path: "/",
        // `secure: true` means HTTPS only; for local dev with http://, this would break
        // unless you remove or dynamically set it only in production:
        secure: process.env.NODE_ENV === "production",
      },
    },
    // If you want to override other cookies (like CSRF token, callbackUrl), you can add them here
    // callbackUrl: { ... },
    // csrfToken: { ... },
  },
  pages: {
    signIn: "/login",
    error: "/login", // Add error page for rate limiting
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          // Check if user exists
          const existingUser = await db.user.findUnique({
            where: { username: credentials?.username },
          });

          if (!existingUser) {
            // Don't reveal whether user exists or not
            await trackFailedAttempt(credentials.username, req);
            return null;
          }

          // Check if user is locked out
          const isLocked = await checkLockout(credentials.username, req);
          if (isLocked) {
            // Create a custom error that NextAuth will pass to the client
            throw new Error("TOO_MANY_ATTEMPTS");
          }

          // Verify password
          const passwordMatch = await bcrypt.compare(
            credentials.password + pepper,
            existingUser.password_hash
          );

          if (!passwordMatch) {
            await trackFailedAttempt(credentials.username, req);
            return null;
          }

          // On successful login, reset failed attempts
          await resetFailedAttempts(credentials.username, req);

          return {
            id: existingUser.id,
            username: existingUser.username,
            email: existingUser.email,
            role: existingUser.role,
          };
        } catch (error: unknown) {
          if (error instanceof Error && error.message === "TOO_MANY_ATTEMPTS") {
            throw error;
          }
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        return {
          ...token,
          username: user.username,
        };
      }
      return token;
    },
    async session({ session, user, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          username: token.username,
          role: token.role,
          id: token.id,
        },
      };
    },
  },
};

/**
 * Track failed login attempts in the database
 * 
 * @param {string} username - The username that failed to login
 * @param {any} req - The NextAuth request object 
 */
async function trackFailedAttempt(username: string, req: any) {
  const ip = req.headers?.["x-forwarded-for"]?.split(',')[0] || 
             req.socket?.remoteAddress || 
             'unknown';
  
  try {
    // Find or create a login attempt record
    const existingAttempt = await db.loginAttempt.findFirst({
      where: {
        username: username,
        ip: ip,
      },
    });

    const now = new Date();

    if (existingAttempt) {
      // Check if the lockout period has passed
      if (existingAttempt.lockedUntil && existingAttempt.lockedUntil > now) {
        // Still locked out, no need to update
        return;
      }

      // Reset if the last attempt was more than 24 hours ago
      const resetAttempts = existingAttempt.lastAttempt &&
        (now.getTime() - existingAttempt.lastAttempt.getTime() > 24 * 60 * 60 * 1000);

      const newAttemptCount = resetAttempts ? 1 : existingAttempt.attempts + 1;
      
      // Calculate lockout if needed
      let lockedUntil = null;
      if (newAttemptCount >= RATE_LIMIT.MAX_ATTEMPTS) {
        lockedUntil = new Date(now.getTime() + RATE_LIMIT.LOCKOUT_DURATION);
      }

      // Update the existing record
      await db.loginAttempt.update({
        where: { id: existingAttempt.id },
        data: {
          attempts: newAttemptCount,
          lastAttempt: now,
          lockedUntil: lockedUntil,
        },
      });
    } else {
      // Create a new record
      await db.loginAttempt.create({
        data: {
          username: username,
          ip: ip,
          attempts: 1,
          lastAttempt: now,
          lockedUntil: null,
        },
      });
    }
  } catch (error) {
    console.error("Error tracking login attempt:", error);
    // Continue authentication process even if tracking fails
  }
}

/**
 * Check if a user is currently locked out
 * 
 * @param {string} username - The username to check
 * @param {any} req - The NextAuth request object
 * @returns {Promise<boolean>} - True if the user is locked out
 */
async function checkLockout(username: string, req: any): Promise<boolean> {
  const ip = req.headers?.["x-forwarded-for"]?.split(',')[0] || 
             req.socket?.remoteAddress || 
             'unknown';
             
  try {
    const loginAttempt = await db.loginAttempt.findFirst({
      where: {
        username: username,
        ip: ip,
      },
    });

    if (loginAttempt && loginAttempt.lockedUntil) {
      const now = new Date();
      
      if (loginAttempt.lockedUntil > now) {
        // User is locked out
        return true;
      } else {
        // Lockout period has expired, reset the lockout
        await db.loginAttempt.update({
          where: { id: loginAttempt.id },
          data: {
            lockedUntil: null,
          },
        });
      }
    }
    
    return false;
  } catch (error) {
    console.error("Error checking lockout status:", error);
    // In case of error, allow the login attempt
    return false;
  }
}

/**
 * Reset failed attempts after successful login
 * 
 * @param {string} username - The username to reset attempts for
 * @param {any} req - The NextAuth request object
 */
async function resetFailedAttempts(username: string, req: any): Promise<void> {
  const ip = req.headers?.["x-forwarded-for"]?.split(',')[0] || 
             req.socket?.remoteAddress || 
             'unknown';
             
  try {
    const loginAttempt = await db.loginAttempt.findFirst({
      where: {
        username: username,
        ip: ip,
      },
    });

    if (loginAttempt) {
      await db.loginAttempt.update({
        where: { id: loginAttempt.id },
        data: {
          attempts: 0,
          lockedUntil: null,
        },
      });
    }
  } catch (error) {
    console.error("Error resetting failed attempts:", error);
    // Continue even if reset fails
  }
}