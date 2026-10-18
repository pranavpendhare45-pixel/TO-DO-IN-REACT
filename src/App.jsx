import { useEffect, useState } from "react";

const TASKS_KEY = "my-todo-tasks";
const THEME_KEY = "my-todo-theme";

const App = () => {
  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = localStorage.getItem(TASKS_KEY);

      if (savedTasks) {
        const parsed = JSON.parse(savedTasks);
        return Array.isArray(parsed) ? parsed : [];
      }

      return [];
    } catch {
      return [];
    }
  });

  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_KEY);
      return savedTheme === "light" || savedTheme === "dark"
        ? savedTheme
        : "dark";
    } catch {
      return "dark";
    }
  });

  const [input, setInput] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskValue, setEditTaskValue] = useState("");
  const [filter, setFilter] = useState("all");

  const isDark = theme === "dark";

  useEffect(() => {
    try {
      localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error("Unable to save tasks:", error);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (error) {
      console.error("Unable to save theme:", error);
    }
  }, [theme]);

  function addTask(event) {
    event.preventDefault();

    const text = input.trim();

    if (!text) {
      alert("Please enter a task");
      return;
    }

    const newTask = {
      id: Date.now(),
      text,
      completed: false,
    };

    setTasks((prev) => [...prev, newTask]);
    setInput("");
  }

  function checkTask(id) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  }

  function cancelEdit() {
    setEditTaskId(null);
    setEditTaskValue("");
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((task) => task.id !== id));

    if (editTaskId === id) {
      cancelEdit();
    }
  }

  function handleEdit(task) {
    setEditTaskId(task.id);
    setEditTaskValue(task.text);
  }

  function saveEdit(id) {
    const text = editTaskValue.trim();

    if (!text) {
      alert("Task cannot be empty");
      return;
    }

    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, text } : task)),
    );

    cancelEdit();
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === "pending") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const filterButtons = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Completed", value: "completed" },
  ];

  const pageClass = isDark
    ? "bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950 text-white"
    : "bg-gradient-to-br from-gray-100 via-white to-indigo-100 text-gray-900";

  const cardClass = isDark
    ? "border-gray-700/70 bg-gray-900/90"
    : "border-gray-200 bg-white/90";

  const inputClass = isDark
    ? "border-gray-700 bg-gray-800 text-white placeholder-gray-500"
    : "border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400";

  const secondaryText = isDark ? "text-gray-400" : "text-gray-600";

  return (
    <div
      className={`min-h-screen flex flex-col items-center px-4 py-10 gap-8 transition-colors duration-300 ${pageClass}`}
    >
      <div
        className={`w-full max-w-4xl rounded-2xl border p-6 sm:p-10 shadow-2xl flex flex-col gap-8 transition-colors duration-300 ${cardClass}`}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="text-center sm:text-left">
            <h1 className="font-extrabold text-4xl sm:text-5xl tracking-tight bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              My Tasks
            </h1>

            <p className={`mt-3 text-sm sm:text-base ${secondaryText}`}>
              Organize your day, one task at a time.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setTheme((prev) => (prev === "dark" ? "light" : "dark"))
            }
            aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
            className={`rounded-xl border px-5 py-3 font-semibold transition active:scale-95 cursor-pointer ${
              isDark
                ? "border-gray-600 bg-gray-800 text-yellow-300 hover:bg-gray-700"
                : "border-gray-300 bg-white text-indigo-700 hover:bg-gray-100"
            }`}
          >
            {isDark ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        <form onSubmit={addTask} className="flex flex-col sm:flex-row gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Enter your task..."
            className={`flex-1 min-w-0 rounded-xl border px-5 py-3.5 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 ${inputClass}`}
          />

          <button
            type="submit"
            className="rounded-xl bg-indigo-600 px-7 py-3.5 font-semibold text-white transition hover:bg-indigo-500 active:scale-95 cursor-pointer"
          >
            ADD
          </button>
        </form>

        <div
          className={`flex flex-wrap gap-3 border-b pb-5 ${
            isDark ? "border-gray-800" : "border-gray-200"
          }`}
        >
          {filterButtons.map((button) => (
            <button
              key={button.value}
              type="button"
              onClick={() => setFilter(button.value)}
              className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition cursor-pointer ${
                filter === button.value
                  ? "bg-indigo-600 text-white shadow-md"
                  : isDark
                    ? "border border-gray-700 bg-gray-800 text-gray-300 hover:border-indigo-500"
                    : "border border-gray-300 bg-gray-100 text-gray-700 hover:border-indigo-500"
              }`}
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full max-w-3xl px-1">
        {filteredTasks.length > 0 ? (
          <div
            className={`flex flex-col gap-4 rounded-2xl border p-4 sm:p-5 shadow-xl transition-colors duration-300 ${cardClass}`}
          >
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b last:border-b-0 pb-4 last:pb-0 ${
                  isDark ? "border-gray-800" : "border-gray-200"
                }`}
              >
                {/* Task Content */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {editTaskId !== task.id && (
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => checkTask(task.id)}
                      aria-label={`Complete ${task.text}`}
                      className="h-5 w-5 accent-indigo-500 cursor-pointer shrink-0"
                    />
                  )}

                  {editTaskId === task.id ? (
                    <input
                      autoFocus
                      value={editTaskValue}
                      onChange={(e) => setEditTaskValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          saveEdit(task.id);
                        }

                        if (e.key === "Escape") {
                          cancelEdit();
                        }
                      }}
                      aria-label="Edit task"
                      className={`w-full min-w-0 rounded-lg border border-indigo-500 px-3 py-2 outline-none ${inputClass}`}
                    />
                  ) : (
                    <p
                      className={`break-words text-lg sm:text-xl font-semibold ${
                        task.completed
                          ? `line-through opacity-50 ${secondaryText}`
                          : isDark
                            ? "text-gray-200"
                            : "text-gray-800"
                      }`}
                    >
                      {task.text}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 sm:justify-end">
                  {editTaskId === task.id ? (
                    <>
                      <button
                        type="button"
                        onClick={() => saveEdit(task.id)}
                        className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 font-semibold text-emerald-500 transition hover:bg-emerald-500 hover:text-white cursor-pointer"
                      >
                        Save
                      </button>

                      <button
                        type="button"
                        onClick={cancelEdit}
                        className={`rounded-lg border px-4 py-2 font-semibold transition cursor-pointer ${
                          isDark
                            ? "border-gray-600 bg-gray-800 text-gray-300 hover:bg-gray-700"
                            : "border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleEdit(task)}
                        className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-5 py-2 font-semibold text-blue-500 transition hover:bg-blue-500 hover:text-white cursor-pointer"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteTask(task.id)}
                        className="rounded-lg border border-red-500/30 bg-red-500/10 px-5 py-2 font-semibold text-red-500 transition hover:bg-red-500 hover:text-white cursor-pointer"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className={`flex flex-col items-center justify-center gap-2 rounded-2xl border p-8 text-center shadow-xl ${cardClass}`}
          >
            <p className="text-xl sm:text-2xl font-semibold">
              {tasks.length === 0
                ? "No Tasks Added"
                : `No ${filter === "pending" ? "Pending" : "Completed"} Tasks`}
            </p>

            <p className={`text-sm ${secondaryText}`}>
              {tasks.length === 0
                ? "Add your first task to get started."
                : "Try another filter to see your tasks."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
