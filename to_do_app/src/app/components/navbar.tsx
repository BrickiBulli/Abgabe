"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
// If you're using NextAuth, import these:
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Use Next.js's usePathname hook to detect the current path
  const pathname = usePathname();
  
  // If using NextAuth:
  const { data: session } = useSession();

  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = async () => {
    closeMenu();
    await signOut({ callbackUrl: "/" });
  };

  return (
    <>
      {/* HAMBURGER ICON - with improved styling */}
      <button
        onClick={openMenu}
        className={`fixed top-4 left-4 z-50 p-2.5 rounded-full bg-indigo-600 text-white 
                    hover:bg-indigo-700 transition-all duration-300 shadow-lg
                    ${isMenuOpen ? "hidden" : "flex items-center justify-center"}`}
        aria-label="Toggle menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* OVERLAY with smoother transition */}
      <div
        onClick={closeMenu}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-all duration-300
                    ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />

      {/* SIDE NAV with improved design */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-gray-900 to-indigo-900 text-white shadow-2xl z-50 
                    transform transition-transform duration-300 ease-in-out
                    ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* CONTENT with improved layout */}
        <div className="p-6 flex flex-col h-full" onClick={(e) => e.stopPropagation()}>
          {/* CLOSE BUTTON */}
          <div className="absolute top-4 right-4">
            <button 
              onClick={closeMenu}
              className="p-1.5 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* APP TITLE */}
          <div className="mb-8 mt-2">
            <h1 className="text-2xl font-bold tracking-tight flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-7 w-7 mr-2 text-indigo-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <span>ToDo App</span>
            </h1>
          </div>

          {/* NAV LINKS - with active state */}
          <ul className="flex-1 flex flex-col space-y-1.5">
            <li>
              <Link
                href="/"
                className={`flex items-center p-3 rounded-lg transition-all
                           ${pathname === "/" 
                             ? "bg-indigo-700 text-white font-medium" 
                             : "text-gray-200 hover:bg-gray-800/60"}`}
                onClick={closeMenu}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h2"
                  />
                </svg>
                Home
              </Link>
            </li>

            {/* Dashboard */}
            {session && (
              <li>
                <Link
                  href="/dashboard"
                  className={`flex items-center p-3 rounded-lg transition-all
                             ${pathname === "/dashboard" 
                               ? "bg-indigo-700 text-white font-medium" 
                               : "text-gray-200 hover:bg-gray-800/60"}`}
                  onClick={closeMenu}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                    />
                  </svg>
                  Dashboard
                </Link>
              </li>
            )}

            {/* Admin (only if role=2) */}
            {session?.user?.role === 2 && (
              <li>
                <Link
                  href="/admin"
                  className={`flex items-center p-3 rounded-lg transition-all
                             ${pathname === "/admin" 
                               ? "bg-indigo-700 text-white font-medium" 
                               : "text-gray-200 hover:bg-gray-800/60"}`}
                  onClick={closeMenu}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Admin
                </Link>
              </li>
            )}
          </ul>

          {/* USER SECTION */}
          {session && (
            <div className="mb-6 mt-4 p-3 bg-gray-800/40 rounded-lg">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center mr-3">
                  <span className="text-lg font-medium">
                    {session.user?.name?.charAt(0) || "U"}
                  </span>
                </div>
                <div className="flex-1 truncate">
                  <p className="font-medium">{session.user?.name || "User"}</p>
                  <p className="text-xs text-gray-400 truncate">{session.user?.email || ""}</p>
                </div>
              </div>
            </div>
          )}

          {/* LOGIN / LOGOUT BUTTON */}
          <div className="mt-auto">
            {session ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 
                           text-white py-2.5 px-4 rounded-lg transition-all duration-200"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                  />
                </svg>
                Sign Out
              </button>
            ) : (
              <Link
                href="/login"
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 
                           text-white py-2.5 px-4 rounded-lg transition-all duration-200 shadow-md"
                onClick={closeMenu}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" 
                  />
                </svg>
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}