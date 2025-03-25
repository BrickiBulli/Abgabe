import Link from "next/link";
import { requireSession } from "@/lib/session";

/**
 * A server component NavBar that:
 *  - Tries to fetch session (throws if none),
 *  - If session is missing, we catch the error & show a "Login" link,
 *  - If present, show "Logout", "Dashboard", and if role=admin => show "Admin".
 */
export default async function Navbar() {
  let session = null;

  try {
    // Throws if no session, so we catch below
    session = await requireSession();
  } catch (error) {
    // If there's no session, session stays null
  }

  return (
    <nav className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
      {/* Left: App icon + home link */}
      <Link href="/" className="flex items-center space-x-2">
        {/* Simple "clipboard" icon for a "to-do" style. Change as desired. */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 2h6a2 2 0 012 2v2h3
               a1 1 0 011 1v2a9 9 0 11-18 0V7
               a1 1 0 011-1h3V4a2 2 0 012-2z"
          />
        </svg>
        <span className="font-bold">MyTodoApp</span>
      </Link>

      {/* Center: Dashboard + Admin links if session exists */}
      <div className="flex items-center space-x-4">
        {session && (
          <>
            <Link href="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            {session.user.role === 2 && (
              <Link href="/admin" className="hover:underline">
                Admin
              </Link>
            )}
          </>
        )}
      </div>

      {/* Right: Login or Logout */}
      <div>
        {session ? (
          // NextAuth's signOut() action route is /api/auth/signout by default
          // You can also build a client-side signOut() button, but here's a server-friendly approach:
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="border border-white px-3 py-1 rounded 
                         hover:bg-purple-600 hover:shadow-lg 
                         hover:shadow-purple-600/50 transition"
            >
              Logout
            </button>
          </form>
        ) : (
          <Link
            href="/login"
            className="border border-white px-3 py-1 rounded 
                       hover:bg-purple-600 hover:shadow-lg 
                       hover:shadow-purple-600/50 transition"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
