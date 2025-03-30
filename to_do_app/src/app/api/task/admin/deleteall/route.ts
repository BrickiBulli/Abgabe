// File: /app/api/task/admin/deleteall/route.ts

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function DELETE() {
  try {
    // Get the current session to verify admin role
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and has admin role
    if (!session || session.user.role !== 2) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin privileges required.' },
        { status: 403 }
      );
    }
    
    // Delete all tasks
    await db.task.deleteMany({});
    
    return NextResponse.json(
      { message: 'All tasks deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting all tasks:', error);
    return NextResponse.json(
      { error: 'Failed to delete all tasks' },
      { status: 500 }
    );
  }
}