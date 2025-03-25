"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { z } from "zod";

// 1) Create a Zod schema (optional, but recommended)
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

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMsg("");
    setSuccessMsg("");

    const validationResult = loginSchema.safeParse({ username, password });
    if (!validationResult.success) {
      const allErrors = validationResult.error.issues
        .map((issue) => issue.message)
        .join("\n");
      setErrorMsg(allErrors);
      return;
    }

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false, 
      });

      if (result?.error) {
        setErrorMsg("Invalid username or password. Please try again.");
        return;
      }

      setSuccessMsg("Login successful!");
      router.push("/admin"); 
    } catch (err) {
      setErrorMsg("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 rounded-lg border border-white shadow-md p-8 w-full max-w-md mx-4">
        <h1 className="text-2xl font-semibold mb-6 text-center">Sign In</h1>
        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block mb-1 font-medium">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="w-full p-2 rounded border border-white bg-gray-900 placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full p-2 rounded border border-white bg-gray-900 placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {errorMsg && <p className="text-red-400 whitespace-pre-line">{errorMsg}</p>}
          {successMsg && <p className="text-green-400">{successMsg}</p>}

          <button
            type="submit"
            className="w-full rounded border border-white p-2 font-semibold shadow-md 
                       hover:bg-purple-600 hover:shadow-lg hover:shadow-purple-600/50 
                       focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          >
            Sign In
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm">
            Don't have an account?
            <button
              onClick={() => router.push("/register")}
              className="ml-1 underline hover:text-purple-500 transition"

            >
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
