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
  const [dateError, setDateError] = useState<string>("");

  // Get today's date in YYYY-MM-DD format for date input min attribute
  const today = new Date().toISOString().split("T")[0];

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/task");
      const data = await res.json();
      // Sort tasks by due date (most recent first)
      setTasks(data.sort((a: Task, b: Task) => 
        new Date(a.duedate).getTime() - new Date(b.duedate).getTime()
      ));
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleOpenAddModal = () => {
    setForm({ title: "", description: "", duedate: today, status: 0 });
    setDateError("");
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setDateError("");
  };

  const handleEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setForm({
      title: task.title,
      description: task.description || "",
      duedate: task.duedate ? task.duedate.split("T")[0] : "",
      status: task.status,
    });
    setDateError("");
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingTaskId(null);
    setDateError("");
  };

  const validateDate = (dateString: string): boolean => {
    const selectedDate = new Date(dateString);
    const todayDate = new Date(today);
    
    // Clear hours, minutes, seconds for proper date comparison
    selectedDate.setHours(0, 0, 0, 0);
    todayDate.setHours(0, 0, 0, 0);
    
    if (selectedDate < todayDate) {
      setDateError("Due date cannot be before today");
      return false;
    }
    
    setDateError("");
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validate the due date
    if (!validateDate(form.duedate)) {
      return;
    }

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

  // Group tasks by status
  const pendingTasks = tasks.filter(task => task.status === 0);
  const completedTasks = tasks.filter(task => task.status === 1);

  return (
    <div className="bg-gradient-to-br from-gray-900 to-purple-900 text-white min-h-screen flex flex-col">
      <header className="backdrop-blur-sm bg-black/30 sticky top-0 z-10 flex items-center justify-between px-8 py-4 border-b border-purple-500/30">
        <h1 className="pl-8 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300">Task Manager</h1>
        <button
          className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 font-semibold shadow-lg hover:shadow-xl hover:shadow-purple-600/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ease-in-out"
          onClick={handleOpenAddModal}
        >
          + New Task
        </button>
      </header>

      <main className="px-9 py-6 flex-1">
        <div className="max-w-5xl mx-auto">
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-purple-500/20">
              <h3 className="text-xl font-semibold mb-2">No tasks available</h3>
              <p className="text-gray-300 mb-4">Create your first task to get started</p>
              <button 
                onClick={handleOpenAddModal}
                className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 font-semibold"
              >
                Create Task
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Pending Tasks Section */}
              <div>
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <span className="h-3 w-3 rounded-full bg-yellow-400 mr-2"></span>
                  Pending Tasks ({pendingTasks.length})
                </h2>
                
                {pendingTasks.length === 0 ? (
                  <p className="text-gray-400 italic">No pending tasks</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pendingTasks.map((task) => (
                      <div
                        key={task.id}
                        className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4 hover:shadow-lg hover:shadow-purple-600/20 transition-all duration-300"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl font-semibold">{task.title}</h3>
                          <span className="bg-yellow-600 text-xs px-2 py-1 rounded-full">Pending</span>
                        </div>
                        
                        {task.description && (
                          <p className="text-gray-300 mb-3">{task.description}</p>
                        )}
                        
                        <div className="flex items-center text-sm text-gray-300 mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>Due: {new Date(task.duedate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(task)}
                            className="flex-1 rounded-full border border-purple-500 px-3 py-1 text-sm font-semibold hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(task.id)}
                            className="flex-1 rounded-full border border-red-500 px-3 py-1 text-sm font-semibold hover:bg-red-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Completed Tasks Section */}
              <div>
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <span className="h-3 w-3 rounded-full bg-green-400 mr-2"></span>
                  Completed Tasks ({completedTasks.length})
                </h2>
                
                {completedTasks.length === 0 ? (
                  <p className="text-gray-400 italic">No completed tasks</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {completedTasks.map((task) => (
                      <div
                        key={task.id}
                        className="bg-gray-800/50 backdrop-blur-sm border border-green-500/20 rounded-xl p-4 hover:shadow-lg hover:shadow-green-600/20 transition-all duration-300"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl font-semibold">{task.title}</h3>
                          <span className="bg-green-600 text-xs px-2 py-1 rounded-full">Completed</span>
                        </div>
                        
                        {task.description && (
                          <p className="text-gray-300 mb-3">{task.description}</p>
                        )}
                        
                        <div className="flex items-center text-sm text-gray-300 mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>Due: {new Date(task.duedate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(task)}
                            className="flex-1 rounded-full border border-purple-500 px-3 py-1 text-sm font-semibold hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(task.id)}
                            className="flex-1 rounded-full border border-red-500 px-3 py-1 text-sm font-semibold hover:bg-red-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm">
          <div className="bg-gray-800 border border-purple-500/30 p-6 rounded-xl shadow-2xl max-w-lg w-full mx-4 transform transition-all">
            <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300">Add New Task</h2>
            <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="title-add" className="block mb-1 font-medium">
                  Title
                </label>
                <input
                  id="title-add"
                  type="text"
                  className="w-full p-3 rounded-lg border border-purple-500/30 bg-gray-900/80 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
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
                  className="w-full p-3 rounded-lg border border-purple-500/30 bg-gray-900/80 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  value={form.description}
                  rows={3}
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
                  className={`w-full p-3 rounded-lg border ${dateError ? "border-red-500" : "border-purple-500/30"} bg-gray-900/80 placeholder-gray-400 focus:outline-none focus:ring-2 ${dateError ? "focus:ring-red-500" : "focus:ring-purple-500"} transition`}
                  value={form.duedate}
                  min={today}
                  onChange={(e) => {
                    setForm({ ...form, duedate: e.target.value });
                    validateDate(e.target.value);
                  }}
                  required
                />
                {dateError && <p className="text-red-500 text-sm mt-1">{dateError}</p>}
              </div>

              <div>
                <label htmlFor="status-add" className="block mb-1 font-medium">
                  Status
                </label>
                <select
                  id="status-add"
                  className="w-full p-3 rounded-lg border border-purple-500/30 bg-gray-900/80 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: parseInt(e.target.value) })
                  }
                >
                  <option value={0}>Pending</option>
                  <option value={1}>Completed</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  className="rounded-lg px-5 py-2 font-semibold shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
                  onClick={handleCloseAddModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2 font-semibold shadow-md hover:shadow-lg hover:shadow-purple-600/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {showEditModal && editingTaskId && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm">
          <div className="bg-gray-800 border border-purple-500/30 p-6 rounded-xl shadow-2xl max-w-lg w-full mx-4 transform transition-all">
            <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300">Edit Task</h2>
            <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="title-edit" className="block mb-1 font-medium">
                  Title
                </label>
                <input
                  id="title-edit"
                  type="text"
                  className="w-full p-3 rounded-lg border border-purple-500/30 bg-gray-900/80 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
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
                  className="w-full p-3 rounded-lg border border-purple-500/30 bg-gray-900/80 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  value={form.description}
                  rows={3}
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
                  className={`w-full p-3 rounded-lg border ${dateError ? "border-red-500" : "border-purple-500/30"} bg-gray-900/80 placeholder-gray-400 focus:outline-none focus:ring-2 ${dateError ? "focus:ring-red-500" : "focus:ring-purple-500"} transition`}
                  value={form.duedate}
                  min={today}
                  onChange={(e) => {
                    setForm({ ...form, duedate: e.target.value });
                    validateDate(e.target.value);
                  }}
                  required
                />
                {dateError && <p className="text-red-500 text-sm mt-1">{dateError}</p>}
              </div>

              <div>
                <label htmlFor="status-edit" className="block mb-1 font-medium">
                  Status
                </label>
                <select
                  id="status-edit"
                  className="w-full p-3 rounded-lg border border-purple-500/30 bg-gray-900/80 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: parseInt(e.target.value) })
                  }
                >
                  <option value={0}>Pending</option>
                  <option value={1}>Completed</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  className="rounded-lg px-5 py-2 font-semibold shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
                  onClick={handleCloseEditModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2 font-semibold shadow-md hover:shadow-lg hover:shadow-purple-600/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}