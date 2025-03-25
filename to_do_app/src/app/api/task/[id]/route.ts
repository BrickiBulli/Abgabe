import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/session";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } | Promise<{ id: string }>}
) {
  try {
    const resolvedParams = await params;
    const body = await req.json();
    const { title, description, duedate, status } = body;
    const session = await requireSession();
    const taskToEdit = await db.task.findUnique({
      where: {id: resolvedParams.id}
    })

    if(taskToEdit?.user_id !== session.user.id && session.user.role !== 2){
      return NextResponse.json({error: "You do not have permission to edit this task"}, {status: 401})
    }

    const updatedTask = await db.task.update({
      where: { id: resolvedParams.id },
      data: {
        title,
        description,
        duedate: new Date(duedate),
        status,
      },
    });
    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error updating task" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
 { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const session = await requireSession();
    const taskToDelete = await db.task.findUnique({
      where: {id: resolvedParams.id}
    })

    if(taskToDelete?.user_id !== session.user.id && session.user.role !== 2){
      return NextResponse.json({error: "You do not have permission to delete this task"}, {status: 401})
    }

    const deletedTask = await db.task.delete({
      where: { id: resolvedParams.id },
    });
    return NextResponse.json(deletedTask, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error deleting task" },
      { status: 500 }
    );
  }
}
