"use client"

import React, { useState } from 'react';
import TaskForm from '../components/task';

export default function Dashboard() {
  const [mode, setMode] = useState<'create' | 'edit'>('create');

  // Hard-coded user ID (in a real app, fetch from session or auth)
  const userId = 'some-user-id';

  // Mock existing task for demonstration
  const [existingTask] = useState({
    id: 'existing-task-id',
    title: 'Existing Title',
    description: 'Existing description',
    duedate: new Date().toISOString(), // e.g. "2025-03-20T10:30:00Z"
    status: 0,
    user_id: userId,
  });

  // Callback to do something after create/update/delete
  const handleSuccess = () => {
    console.log('Operation succeeded, refresh data or redirect');
    // e.g., re-fetch tasks, or redirect to a different page
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Task Dashboard</h1>
      
      <button onClick={() => setMode('create')}>Switch to Create Mode</button>
      <button onClick={() => setMode('edit')}>Switch to Edit Mode</button>

      {mode === 'create' && (
        <TaskForm mode="create" userId={userId} onSuccess={handleSuccess} />
      )}

      {mode === 'edit' && (
        <TaskForm
          mode="edit"
          existingTask={existingTask}
          userId={userId}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
