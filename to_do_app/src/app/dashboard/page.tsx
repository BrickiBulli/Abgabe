"use client";
import { useState, useEffect, FormEvent } from "react";

interface Task {
  id: string;
  title: string;
  description?: string;
  duedate: string;
  status: number;
  user_id: string;
}

interface TaskForm {
  title: string;
  description: string;
  duedate: string;
  status: number;
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [form, setForm] = useState<TaskForm>({
    title: "",
    description: "",
    duedate: "",
    status: 0,
  });
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  // Fetch tasks from the API
  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/task");
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Handle form submit for adding/updating tasks
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (editingTaskId) {
      // Update an existing task
      try {
        const res = await fetch(`/api/task/${editingTaskId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (res.ok) {
          await fetchTasks();
          setEditingTaskId(null);
          setForm({ title: "", description: "", duedate: "", status: 0 });
        }
      } catch (error) {
        console.error("Failed to update task", error);
      }
    } else {
      // Create a new task (replace "some-user-id" with the actual user ID from your auth/session)
      try {
        const res = await fetch("/api/task", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ form }),
        });
        if (res.ok) {
          await fetchTasks();
          setForm({ title: "", description: "", duedate: "", status: 0 });
        }
      } catch (error) {
        console.error("Failed to create task", error);
      }
    }
  };

  // Prepare the form for editing a task
  const handleEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setForm({
      title: task.title,
      description: task.description || "",
      duedate: task.duedate ? task.duedate.split("T")[0] : "",
      status: task.status,
    });
  };

  // Delete a task
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/task/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchTasks();
      }
    } catch (error) {
      console.error("Failed to delete task", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 rounded-lg border border-white shadow-md p-8 w-full max-w-lg mx-4">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Todo Dashboard
        </h1>
        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title" className="block mb-1 font-medium">
              Title
            </label>
            <input
              id="title"
              type="text"
              className="w-full p-2 rounded border border-white bg-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Task title"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block mb-1 font-medium">
              Description
            </label>
            <textarea
              id="description"
              className="w-full p-2 rounded border border-white bg-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Task description"
            />
          </div>

          <div>
            <label htmlFor="duedate" className="block mb-1 font-medium">
              Due Date
            </label>
            <input
              id="duedate"
              type="date"
              className="w-full p-2 rounded border border-white bg-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={form.duedate}
              onChange={(e) => setForm({ ...form, duedate: e.target.value })}
              required
            />
          </div>

          <div>
            <label htmlFor="status" className="block mb-1 font-medium">
              Status
            </label>
            <select
              id="status"
              className="w-full p-2 rounded border border-white bg-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: parseInt(e.target.value) })
              }
            >
              <option value={0}>Pending</option>
              <option value={1}>Completed</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full rounded border border-white p-2 font-semibold shadow-md hover:bg-purple-600 hover:shadow-lg hover:shadow-purple-600/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          >
            {editingTaskId ? "Update Task" : "Add Task"}
          </button>
        </form>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>
          {tasks.length === 0 ? (
            <p>No tasks available.</p>
          ) : (
            <ul className="space-y-4">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="p-4 border border-white rounded flex flex-col"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{task.title}</h3>
                    <span
                      className={`px-2 py-1 rounded ${
                        task.status === 1 ? "bg-green-600" : "bg-yellow-600"
                      }`}
                    >
                      {task.status === 1 ? "Completed" : "Pending"}
                    </span>
                  </div>
                  {task.description && (
                    <p className="mt-2">{task.description}</p>
                  )}
                  <p className="mt-2 text-sm">
                    Due: {new Date(task.duedate).toLocaleDateString()}
                  </p>
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => handleEdit(task)}
                      className="flex-1 rounded border border-white p-2 font-semibold shadow-md hover:bg-purple-600 hover:shadow-lg hover:shadow-purple-600/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="flex-1 rounded border border-white p-2 font-semibold shadow-md hover:bg-red-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
