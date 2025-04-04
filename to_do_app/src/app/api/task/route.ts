// /app/api/tasks/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/session";

// GET: Fetch all tasks
export async function GET() {
  try {
    const session = await requireSession();
    const tasks = await db.task.findMany({
      where: { user_id: session.user.id },
    });
    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error fetching tasks" },
      { status: 500 }
    );
  }
}

// POST: Create a new task
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, duedate, status } = body.form;
    const session = await requireSession();
    const parsedDate = new Date(duedate);

    const newTask = await db.task.create({
      data: {
        title,
        description: description,
        duedate: parsedDate,
        status,
        user_id: session.user.id,
      },
    });
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error creating task" }, { status: 500 });
  }
}
