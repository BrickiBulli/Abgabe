"use client"

import React, { useState, useEffect } from 'react';

type TaskFormProps = {
  mode: 'create' | 'edit';
  existingTask?: {
    id: string;
    title: string;
    description?: string;
    duedate: string; // ISO string
    status: number;
    user_id: string;
  };
  userId: string; // The user that the task belongs to
  onSuccess?: () => void; // callback after success
};

const TaskForm: React.FC<TaskFormProps> = ({ mode, existingTask, userId, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duedate, setDueDate] = useState('');
  const [status, setStatus] = useState(0);

  useEffect(() => {
    if (mode === 'edit' && existingTask) {
      setTitle(existingTask.title);
      setDescription(existingTask.description || '');
      setDueDate(existingTask.duedate); // ISO date, e.g. "2025-03-20T10:30:00Z"
      setStatus(existingTask.status);
    }
  }, [mode, existingTask]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!title || !duedate) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      if (mode === 'create') {
        // POST => create
        const response = await fetch('/api/tasks', {
          method: 'POST',
          body: JSON.stringify({
            title,
            description,
            duedate,
            status,
            user_id: userId,
          }),
        });
        if (!response.ok) throw new Error('Failed to create task');
        alert('Task created!');
      } else if (mode === 'edit' && existingTask) {
        // PUT => update
        const response = await fetch('/api/tasks', {
          method: 'PUT',
          body: JSON.stringify({
            id: existingTask.id,
            title,
            description,
            duedate,
            status,
          }),
        });
        if (!response.ok) throw new Error('Failed to update task');
        alert('Task updated!');
      }

      // Optionally reset form (if in create mode)
      if (mode === 'create') {
        setTitle('');
        setDescription('');
        setDueDate('');
        setStatus(0);
      }

      onSuccess && onSuccess();
    } catch (err) {
      console.error('Error:', err);
      alert('An error occurred.');
    }
  };

  const handleDelete = async () => {
    if (!existingTask) return;
    const confirmDelete = confirm('Are you sure you want to delete this task?');
    if (!confirmDelete) return;

    try {
      const response = await fetch('/api/tasks', {
        method: 'DELETE',
        body: JSON.stringify({ id: existingTask.id }),
      });
      if (!response.ok && response.status !== 204) {
        throw new Error('Failed to delete task');
      }
      alert('Task deleted!');
      onSuccess && onSuccess();
    } catch (err) {
      console.error('Error:', err);
      alert('An error occurred while deleting.');
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
      <h2>{mode === 'create' ? 'Create New Task' : 'Edit Task'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="duedate">Due Date:</label>
          <input
            id="duedate"
            type="date"
            value={duedate.split('T')[0]} // if you want local date format
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(Number(e.target.value))}
          >
            <option value={0}>Pending</option>
            <option value={1}>In Progress</option>
            <option value={2}>Completed</option>
          </select>
        </div>

        <button type="submit">{mode === 'create' ? 'Create' : 'Save'}</button>
      </form>

      {mode === 'edit' && (
        <button onClick={handleDelete} style={{ marginTop: '1rem' }}>
          Delete Task
        </button>
      )}
    </div>
  );
};

export default TaskForm;
