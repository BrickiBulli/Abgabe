# Security Documentation

## 1. SQL Injection (QW2)

### 1.1 Prepared Statements / Parametrisierte Queries

Your project uses Prisma ORM which automatically handles prepared statements and parameterized queries.

**Reference in your code:**

```typescript
// Example from route.ts (API endpoints)
const updatedTask = await db.task.update({
  where: { id: resolvedParams.id },
  data: {
    title,
    description,
    duedate: new Date(duedate),
    status,
  },
});
```

Prisma generates prepared statements under the hood, automatically protecting against SQL injection.

### 1.2 Inputvalidierung

You use Zod for input validation:

**Reference in your code:**

```typescript
// From register.tsx
const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username cannot exceed 50 characters")
    .regex(
      /^[A-Za-z0-9_]+$/,
      "Username may only contain letters, digits, or underscores"
    ),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must include at least one uppercase letter")
    .regex(/\d/, "Password must include at least one digit")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must include at least one special character"
    ),
});
```

### 1.3 Rechtebeschränkung DB-User

In your project, you have role-based access controls that restrict what users can do based on their role:

**Reference in your code:**

```typescript
// From /app/api/task/admin/route.ts
export async function GET() {
  try {
    const session = await requireSession();

    if(session?.user?.role != 2){
        return NextResponse.json({error: "You may not access this api endpoint"}, {status: 401});
    }

    const tasks = await db.task.findMany();
    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error fetching all tasks" },
      { status: 500 }
    );
  }
}
```

## 2. Cross-Site Scripting (XSS)

### 2.1 Inputvalidierung

You have input validation both on client and server using Zod:

**Client-side validation (login.tsx):**

```typescript
// From login.tsx
const loginSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username cannot exceed 50 characters")
    .regex(
      /^[A-Za-z0-9_]+$/,
      "Username may only contain letters, digits, or underscores"
    ),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
```

**Server-side validation (register API route):**

```typescript
// From /app/api/register/route.ts
const validationResult = registerSchema.safeParse(body);
    
if (!validationResult.success) {
  // Return validation errors
  return NextResponse.json(
    { 
      user: null, 
      message: "Validation failed", 
      errors: validationResult.error.format() 
    },
    { status: 400 }
  );
}
```

### 2.2 Output Escaping

Your project uses React which automatically escapes content before rendering it:

```tsx
// From dashboard.tsx
{task.description && (
  <p className="text-gray-300 mb-3">{task.description}</p>
)}
```

React automatically escapes user content in JSX expressions, providing protection against XSS.

### 2.3 Sichere Konfiguration der Session / Sessioncookie / Tokens

Your session configuration is in auth.ts:

```typescript
// From lib/auth.ts
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
},
```

## 3. Passwortsicherheit (QW4)

### 3.1 Hashing

You use bcrypt for password hashing:

```typescript
// From /app/api/register/route.ts
const hashedPassword = await hashPassword(password, salt);

// ... 

async function hashPassword(password: string, salt: string): Promise<string> {
  // First add the pepper to the password, then hash with the salt
  return await bcrypt.hash(password + pepper, salt);
}
```

### 3.2 Salt

You create a random salt for each user:

```typescript
// From /app/api/register/route.ts
const salt = await generateSalt();

// ...

async function generateSalt(): Promise<string> {
  return await bcrypt.genSalt(10);
}
```

### 3.3 Pepper

You apply a server-side pepper before hashing:

```typescript
// From lib/auth.ts and /app/api/register/route.ts
const pepper = process.env.PEPPER_SECRET || "";

// ...

async function hashPassword(password: string, salt: string): Promise<string> {
  // First add the pepper to the password, then hash with the salt
  return await bcrypt.hash(password + pepper, salt);
}
```

And for verification:

```typescript
// From lib/auth.ts
const passwordMatch = await bcrypt.compare(
  credentials.password + pepper,
  existingUser.password_hash
);
```

## 4. Sessionhandling (QW4)

### 4.1 Sicherer Loginablauf

Your project has secure login handling with rate limiting:

```typescript
// From lib/auth.ts
// Rate limiting configuration
const RATE_LIMIT = {
  MAX_ATTEMPTS: 5,
  LOCKOUT_DURATION: 10 * 60 * 1000, // 10 minutes in milliseconds
};

// ...

// Check if user is locked out
const isLocked = await checkLockout(credentials.username, req);
if (isLocked) {
  // Create a custom error that NextAuth will pass to the client
  throw new Error("TOO_MANY_ATTEMPTS");
}

// ... and tracking failed attempts
await trackFailedAttempt(credentials.username, req);
```

### 4.2 Session / (Token) Erstellung

NextAuth.js handles session and token creation for you:

```typescript
// From lib/auth.ts
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
```

### 4.3 Umgang mit Session / (Tokens)

You have helper functions to require a session or admin privileges:

```typescript
// From lib/session.ts
export async function requireSession() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  return session;
}

export async function requireAdmin() {
  const session = await requireSession();
  if (session.user?.role !== 2) {
    return null;
  }
  return session; 
}
```

For additional details on NextAuth.js and Prisma security features, I recommend looking at these documentation sources:

1. NextAuth.js Documentation: <https://next-auth.js.org/>
2. Prisma Security Guidelines: <https://www.prisma.io/docs/concepts/components/prisma-client/security>
3. React XSS Prevention: <https://reactjs.org/docs/introducing-jsx.html#jsx-prevents-injection-attacks>
4. Zod Documentation: <https://zod.dev/>

These will provide more detailed information about how these frameworks handle security concerns.
