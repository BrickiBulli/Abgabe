"use client";

import React, { useState } from "react";
import Link from "next/link";
// If you're using NextAuth, import these:
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      {/* HAMBURGER ICON (visible only when the menu is closed) */}
      <button
        onClick={openMenu}
        className={`fixed top-4 left-4 z-50 p-2 rounded bg-gray-800 text-white hover:bg-gray-700 transition 
                    ${isMenuOpen ? "hidden" : "block"}`}
        aria-label="Toggle menu"
      >
        {/* Hamburger SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* OVERLAY (covers screen when menu is open; clicking closes the nav) */}
      <div
        onClick={closeMenu}
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 
                    ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />

      {/* SIDE NAV (slides from the left; remains in DOM always but moves via CSS transform) */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white shadow-md z-50 
                    transform transition-transform duration-300
                    ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* CONTENT: Clicking inside shouldn't close the menu, so stop propagation */}
        <div className="p-4 flex flex-col h-full" onClick={(e) => e.stopPropagation()}>
          {/* NAV LINKS */}
          <ul className="flex-1 flex flex-col space-y-3">
            <li className="border-b-2 pb-2 border-white">
              <h1 className="flex items-center text-2xl">ToDo App Nav</h1>
            </li>
            {/* Home */}
            <li>
              <Link
                href="/"
                className="flex items-center hover:underline"
                onClick={closeMenu}
              >
                {/* Home Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 9.75l9-7.5 9 7.5M4 10.5v10.5
                       a1.5 1.5 0 001.5 1.5h3a1.5 1.5 0 001.5-1.5V15
                       a1.5 1.5 0 011.5-1.5h2a1.5 1.5 0 011.5 1.5v6
                       a1.5 1.5 0 001.5 1.5h3a1.5 1.5 0 001.5-1.5V10.5"
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
                  className="flex items-center hover:underline"
                  onClick={closeMenu}
                >
                  {/* Dashboard Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3h18v13H3V3zm9 13v5m-6-5v5m12-5v5"
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
                  className="flex items-center hover:underline"
                  onClick={closeMenu}
                >
                  {/* Admin Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10 12H6a2 2 0 00-2 2v4h12v-4
                         a2 2 0 00-2-2h-4zM8 12V8a4 4 0 018 0v4
                         m-8 0a4 4 0 11-2 3.464"
                    />
                  </svg>
                  Admin
                </Link>
              </li>
            )}
          </ul>

          {/* BOTTOM: LOGIN / LOGOUT */}
          <div className="mt-4 border-t border-gray-700 pt-4">
            {session ? (
              <button
                onClick={handleLogout}
                className="border border-white px-22 py-1 rounded 
                           hover:bg-purple-600 hover:shadow-lg 
                           hover:shadow-purple-600/50 transition"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="border border-white px-22 py-1 rounded
                           hover:bg-purple-600 hover:shadow-lg 
                           hover:shadow-purple-600/50 transition"
                onClick={closeMenu}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
