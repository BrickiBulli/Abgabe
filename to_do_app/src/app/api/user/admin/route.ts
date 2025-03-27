// /app/api/users/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await requireSession()

    if(session?.user?.role != 2){
        return NextResponse.json({error: "You may not access this api endpoint"}, {status: 401});
    }
    
    const users = await db.user.findMany({
      select: { id: true, username: true },
    });
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Error fetching users" },
      { status: 500 }
    );
  }
}
