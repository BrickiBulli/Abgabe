import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import { z } from "zod";

const pepper = process.env.PEPPER_SECRET || "";

// Define Zod schema for validation with updated rules
const registerSchema = z.object({
  user: z.object({
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
      )
  })
});

async function generateSalt(): Promise<string> {
  return await bcrypt.genSalt(10);
}

async function hashPassword(password: string, salt: string): Promise<string> {
  // First add the pepper to the password, then hash with the salt
  return await bcrypt.hash(password + pepper, salt);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate the request body with Zod
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

    // Extract validated data
    const {
      user: { email, username, password },
    } = validationResult.data;

    const existingUserByEmail = await db.user.findUnique({
      where: { email: email },
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        { user: null, message: "Something went wrong" },
        { status: 409 }
      );
    }

    const existingUserByUsername = await db.user.findUnique({
      where: { username: username },
    });

    if (existingUserByUsername) {
      return NextResponse.json(
        { user: null, message: "Something went wrong" },
        { status: 409 }
      );
    }

    const salt = await generateSalt();
    const hashedPassword = await hashPassword(password, salt);

    const newUser = await db.user.create({
      data: {
        username,
        email,
        role: 1,
        password_hash: hashedPassword,
        password_salt: salt,
      },
    });

    // Don't return the password hash or salt in the response
    const { password_hash, password_salt, ...userWithoutSensitiveInfo } = newUser;

    return NextResponse.json(
      { user: userWithoutSensitiveInfo, message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to create user" },
      { status: 500 }
    );
  }
}