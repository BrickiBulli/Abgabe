import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await requireSession();

    if(session?.user?.role != 2){
        return NextResponse.json({error: "You may not access this api endpoint"}, {status: 401});
    }

    const tasks = await db.task.findMany();
    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error fetching all tasks" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, duedate, status, userId } = body.form;
    const session = await requireSession();
    const parsedDate = new Date(duedate);

    if(session?.user?.role != 2){
      return NextResponse.json({error: "You may not access this api endpoint"}, {status: 401});
    }

    const newTask = await db.task.create({
      data: {
        title,
        description: description,
        duedate: parsedDate,
        status,
        user_id: userId
      },
    });
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error creating task" }, { status: 500 });
  }
}


