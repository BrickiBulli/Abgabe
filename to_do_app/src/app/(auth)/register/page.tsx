"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";

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

export default function RegisterPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMsg("");
    setSuccessMsg("");

    const validationResult = registerSchema.safeParse({ username, email, password });
    if (!validationResult.success) {
      const allErrors = validationResult.error.issues
        .map((issue) => issue.message)
        .join("\n");
      setErrorMsg(allErrors);
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: {
            email,
            username,
            password,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.message || "Something went wrong. Please try again.");
        return;
      }

      router.push("/login");

      setSuccessMsg(data.message || "User registered successfully.");

    } catch (err) {
      setErrorMsg("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 rounded-lg border border-white shadow-md p-8 w-full max-w-md mx-4">
        <h1 className="text-2xl font-semibold mb-6 text-center">Create an Account</h1>
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
              placeholder="Enter a username"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-1 font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full p-2 rounded border border-white bg-gray-900 placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
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
              placeholder="Set a password"
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
            Sign Up
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm">
            Already have an account?
            <button
              onClick={() => router.push("/login")}
              className="ml-1 underline hover:text-purple-500 transition"
            >
              Log In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
