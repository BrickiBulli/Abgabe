"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function HomePage() {
  const { data: session } = useSession();

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-gray-700">
        <h1 className="pl-8 text-2xl font-bold">Todo App</h1>
        { !session && (
        <Link href="/login">
          <span className="cursor-pointer rounded border border-white px-4 py-2 font-semibold shadow-md hover:bg-purple-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition">
            Sign In
          </span>
        </Link>
        )}
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center flex-1 px-8 py-16 text-center">
        <h2 className="text-4xl font-bold mb-4">Stay Organized, Achieve More</h2>
        <p className="text-lg mb-8 max-w-2xl">
          Welcome to Todo App – your ultimate solution for managing tasks and boosting your productivity. Sign in to get started and take control of your day!
        </p>
        { !session && (
          <Link href="/login">
           <span className="cursor-pointer rounded border border-white px-6 py-3 text-lg font-semibold shadow-md hover:bg-purple-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition">
             Get Started
           </span>
         </Link>
        )}
        { session && (
          <Link href="/dashboard">
           <span className="cursor-pointer rounded border border-white px-6 py-3 text-lg font-semibold shadow-md hover:bg-purple-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition">
             Dashboard
           </span>
         </Link>
        )}
      </main>


      {/* Footer */}
      <footer className="text-center p-4 border-t border-gray-700">
        <p>&copy; {new Date().getFullYear()} Todo App. All rights reserved.</p>
      </footer>
    </div>
  );
}
