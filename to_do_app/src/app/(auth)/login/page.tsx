"use client";

import React, { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Check for error parameters when component mounts
  useEffect(() => {
    if (error === "TOO_MANY_ATTEMPTS") {
      setErrorMsg("Too many failed login attempts. Please try again later.");
    } else if (error) {
      setErrorMsg("An error occurred during login. Please try again.");
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset messages
    setErrorMsg("");
    setSuccessMsg("");
    setIsLoading(true);

    // Validate inputs using Zod schema
    const validationResult = loginSchema.safeParse({ username, password });
    if (!validationResult.success) {
      const allErrors = validationResult.error.issues
        .map((issue) => issue.message)
        .join("\n");
      setErrorMsg(allErrors);
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        // Handle specific error messages from the server
        if (result.error === "TOO_MANY_ATTEMPTS") {
          setErrorMsg("Too many failed login attempts. Your account has been temporarily locked. Please try again later.");
        } else {
          setErrorMsg("Invalid username or password. Please try again.");
        }
        setIsLoading(false);
        return;
      }

      setSuccessMsg("Login successful! Redirecting...");
      router.push("/admin");
    } catch (err) {
      console.log(err);
      setErrorMsg("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4">
      <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-xl p-8 w-full max-w-md mx-auto backdrop-blur-sm bg-opacity-90">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">Welcome Back</h1>
        
        {successMsg && (
          <div className="mb-4 p-3 rounded-md bg-green-500 bg-opacity-20 border border-green-500 text-green-300">
            <p className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {successMsg}
            </p>
          </div>
        )}
        
        {errorMsg && (
          <div className="mb-4 p-3 rounded-md bg-red-500 bg-opacity-20 border border-red-500 text-red-300">
            <p className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="whitespace-pre-line">{errorMsg}</span>
            </p>
          </div>
        )}
        
        <form className="flex flex-col space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label htmlFor="username" className="block text-sm font-medium text-gray-300">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                id="username"
                type="text"
                className="block w-full pl-10 p-3 rounded-md border border-gray-600 bg-gray-700 placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                aria-describedby="username-requirements"
                required
              />
            </div>
            <p id="username-requirements" className="text-xs text-gray-400 mt-1">
              Must be 3-50 characters with only letters, numbers, or underscores.
            </p>
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="block w-full pl-10 pr-10 p-3 rounded-md border border-gray-600 bg-gray-700 placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                aria-describedby="password-requirements"
                required
              />
              <button 
                type="button" 
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 hover:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 hover:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            <p id="password-requirements" className="text-xs text-gray-400 mt-1">
              Must be at least 8 characters long.
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md border border-transparent bg-purple-600 py-3 px-4 font-semibold 
                     shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 
                     focus:ring-offset-2 focus:ring-offset-gray-800 transition-all disabled:opacity-70 
                     disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Don&apos;t have an account?
            <button
              onClick={() => router.push("/register")}
              className="ml-1 font-medium text-purple-400 hover:text-purple-300 transition-colors"
            >
              Register Now
            </button>
          </p>
        </div>
        
        <div className="mt-6 pt-5 border-t border-gray-700">
          <p className="text-xs text-center text-gray-500">
            By signing in, you agree to our <a href="#" className="underline hover:text-gray-400">Terms of Service</a> and <a href="#" className="underline hover:text-gray-400">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}