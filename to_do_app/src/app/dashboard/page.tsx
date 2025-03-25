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

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);

  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

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

  const handleOpenAddModal = () => {
    setForm({ title: "", description: "", duedate: "", status: 0 });
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  const handleEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setForm({
      title: task.title,
      description: task.description || "",
      duedate: task.duedate ? task.duedate.split("T")[0] : "",
      status: task.status,
    });
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingTaskId(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (editingTaskId) {
      try {
        const res = await fetch(`/api/task/${editingTaskId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        if (res.ok) {
          await fetchTasks();
          handleCloseEditModal();
        }
      } catch (error) {
        console.error("Failed to update task", error);
      }
    } else {
      try {
        const res = await fetch("/api/task", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ form }),
        });

        if (res.ok) {
          await fetchTasks();
          handleCloseAddModal();
        }
      } catch (error) {
        console.error("Failed to create task", error);
      }
    }
  };

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
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-8 py-4 border-b border-white">
        <h1 className="pl-8 text-2xl font-semibold">Todo Dashboard</h1>
        <button
          className="rounded border border-white px-4 py-2 font-semibold shadow-md hover:bg-purple-600 hover:shadow-lg hover:shadow-purple-600/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          onClick={handleOpenAddModal}
        >
          Add Task
        </button>
      </header>

      <main className="px-9 py-4 flex-1">
        {tasks.length === 0 ? (
          <p>No tasks available.</p>
        ) : (
          <ul className="space-y-4">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between border-b border-white pb-3"
              >
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold">{task.title}</h3>
                  {task.description && (
                    <p className="text-sm mt-1">{task.description}</p>
                  )}
                  <p className="text-sm mt-1">
                    Due: {new Date(task.duedate).toLocaleDateString()}
                  </p>
                  <p
                    className={`mt-1 text-sm px-2 py-1 w-fit rounded ${
                      task.status === 1 ? "bg-green-600" : "bg-yellow-600"
                    }`}
                  >
                    {task.status === 1 ? "Completed" : "Pending"}
                  </p>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(task)}
                    className="rounded border border-white px-3 py-1 text-sm font-semibold hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="rounded border border-white px-3 py-1 text-sm font-semibold hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>

      {showAddModal && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-gray-800 border border-white p-6 rounded shadow-lg max-w-lg w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
            <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="title-add" className="block mb-1 font-medium">
                  Title
                </label>
                <input
                  id="title-add"
                  type="text"
                  className="w-full p-2 rounded border border-white bg-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Task title"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="description-add"
                  className="block mb-1 font-medium"
                >
                  Description
                </label>
                <textarea
                  id="description-add"
                  className="w-full p-2 rounded border border-white bg-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Task description"
                />
              </div>

              <div>
                <label htmlFor="duedate-add" className="block mb-1 font-medium">
                  Due Date
                </label>
                <input
                  id="duedate-add"
                  type="date"
                  className="w-full p-2 rounded border border-white bg-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={form.duedate}
                  onChange={(e) =>
                    setForm({ ...form, duedate: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label htmlFor="status-add" className="block mb-1 font-medium">
                  Status
                </label>
                <select
                  id="status-add"
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

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  className="rounded border border-white px-4 py-2 font-semibold shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
                  onClick={handleCloseAddModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded border border-white px-4 py-2 font-semibold shadow-md hover:bg-purple-600 hover:shadow-lg hover:shadow-purple-600/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && editingTaskId && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-gray-800 border border-white p-6 rounded shadow-lg max-w-lg w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">Edit Task</h2>
            <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="title-edit" className="block mb-1 font-medium">
                  Title
                </label>
                <input
                  id="title-edit"
                  type="text"
                  className="w-full p-2 rounded border border-white bg-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Task title"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="description-edit"
                  className="block mb-1 font-medium"
                >
                  Description
                </label>
                <textarea
                  id="description-edit"
                  className="w-full p-2 rounded border border-white bg-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Task description"
                />
              </div>

              <div>
                <label
                  htmlFor="duedate-edit"
                  className="block mb-1 font-medium"
                >
                  Due Date
                </label>
                <input
                  id="duedate-edit"
                  type="date"
                  className="w-full p-2 rounded border border-white bg-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={form.duedate}
                  onChange={(e) =>
                    setForm({ ...form, duedate: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label htmlFor="status-edit" className="block mb-1 font-medium">
                  Status
                </label>
                <select
                  id="status-edit"
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

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  className="rounded border border-white px-4 py-2 font-semibold shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
                  onClick={handleCloseEditModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded border border-white px-4 py-2 font-semibold shadow-md hover:bg-purple-600 hover:shadow-lg hover:shadow-purple-600/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
