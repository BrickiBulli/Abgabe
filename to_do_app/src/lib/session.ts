
import { getServerSession } from "next-auth";
import { authOptions } from "./auth"; 
import { redirect } from "next/navigation";

export async function getSession() {
  return await getServerSession(authOptions);
}


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
