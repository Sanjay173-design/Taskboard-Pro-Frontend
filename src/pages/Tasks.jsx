import { apiFetch } from "../api/client";
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import TaskModal from "../components/TaskModal";
import toast from "react-hot-toast";

import {
  DndContext,
  closestCorners,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";

/* ---------------- STATUS CONFIG ---------------- */

const STATUSES = ["todo", "in_progress", "done"];

/* ---------------- MAIN COMPONENT ---------------- */

export default function Tasks() {
  const { accessToken } = useAuth();

  const navigate = useNavigate();
  const [params] = useSearchParams();
  const projectId = params.get("projectId");

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [dueFilter, setDueFilter] = useState("all");

  /* ---------------- LOAD TASKS ---------------- */

  const loadTasks = async () => {
    if (!projectId || !accessToken) return;

    try {
      const data = await apiFetch(`/tasks?projectId=${projectId}`, accessToken);
      setTasks(data || []);
    } catch (err) {
      console.error("Load tasks failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!projectId) {
      navigate("/app/projects");
      return;
    }

    loadTasks();

    const interval = setInterval(loadTasks, 8000);
    return () => clearInterval(interval);
  }, [accessToken, projectId]);

  /* ---------------- CREATE TASK ---------------- */

  const createTask = async () => {
    if (!title.trim() || !projectId) return;

    try {
      await apiFetch(`/tasks`, accessToken, {
        method: "POST",
        body: JSON.stringify({
          title,
          projectId,
          status: "todo",
        }),
      });

      toast.success("Task created");
      setTitle("");
      loadTasks();
    } catch (err) {
      console.error("Create task failed", err);
    }
  };

  /* ---------------- DRAG END ---------------- */

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;

    const task = tasks.find((t) => t.taskId === taskId);
    if (!task || task.status === newStatus) return;

    setTasks((prev) =>
      prev.map((t) => (t.taskId === taskId ? { ...t, status: newStatus } : t)),
    );

    try {
      await apiFetch(`/tasks/${taskId}`, accessToken, {
        method: "PATCH",
        body: JSON.stringify({
          status: newStatus,
          projectId,
        }),
      });
    } catch (err) {
      console.error("Status update failed", err);
      loadTasks();
    }
  };

  /* ---------------- FILTER LOGIC ---------------- */

  const filteredTasks = tasks.filter((t) => {
    if (search && !t.title?.toLowerCase().includes(search.toLowerCase()))
      return false;

    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;

    if (dueFilter === "overdue") {
      if (!t.dueDate || new Date(t.dueDate) > new Date()) return false;
    }

    if (dueFilter === "today") {
      if (!t.dueDate) return false;
      if (new Date(t.dueDate).toDateString() !== new Date().toDateString())
        return false;
    }

    return true;
  });

  /* ---------------- LOADING ---------------- */

  if (loading) return <div className="p-10">Loading tasks…</div>;

  /* ---------------- UI ---------------- */

  return (
    <div className="max-w-5xl space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Tasks</h1>
        <p className="text-sm text-gray-500">Manage project work items</p>
      </div>

      {/* ACTION BAR */}
      <div
        className="
    space-y-5
    p-5
    rounded-2xl
    border
    bg-white/70
    backdrop-blur-sm
    shadow-sm
  "
      >
        {/* CREATE ROW */}
        <div className="flex gap-3 items-center">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="New task title"
            className="
              flex-1 min-w-[260px]
              rounded-xl border px-4 py-2.5
              bg-white
              transition
              hover:shadow-md hover:-translate-y-[2px]
            "
          />

          <button
            onClick={createTask}
            className="
              px-6 py-2.5
              bg-black text-white 
              rounded-xl
              font-medium
              transition
              hover:opacity-90 hover:shadow-md hover:-translate-y-[2px]
            "
          >
            Add
          </button>
        </div>

        {/* FILTER ROW */}
        <div className="flex flex-wrap gap-3">
          <input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className=" flex-1 min-w-[260px]
              rounded-xl border px-4 py-2.5
              bg-white
              transition
              hover:shadow-md hover:-translate-y-[2px]"
          />

          {/* <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border px-3 py-2 text-sm bg-white"
          >
            <option value="all">All Status</option>
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select> */}

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-xl border px-3 py-2 text-semibold bg-white"
          >
            <option value="all">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>

          {/* <select
            value={dueFilter}
            onChange={(e) => setDueFilter(e.target.value)}
            className="rounded-xl border px-3 py-2 text-sm bg-white"
          >
            <option value="all">All Dates</option>
            <option value="today">Due Today</option>
            <option value="overdue">Overdue</option>
          </select> */}
        </div>
      </div>

      {/* KANBAN */}
      <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-3 gap-8">
          {STATUSES.map((status) => (
            <Column
              key={status}
              id={status}
              title={status.replace("_", " ").toUpperCase()}
              tasks={filteredTasks.filter((t) => t.status === status)}
              setSelectedTask={setSelectedTask}
            />
          ))}
        </div>
      </DndContext>

      {selectedTask && (
        <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  );
}

/* ---------------- COLUMN ---------------- */

function Column({ id, title, tasks, setSelectedTask }) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className="space-y-4">
      <h2 className="text-sm font-semibold tracking-wide text-gray-900">
        {title}
      </h2>

      {tasks.length === 0 && (
        <div className="rounded-lg border border-dashed p-4 text-xs text-gray-400 text-center">
          No Tasks in This Column
        </div>
      )}

      {tasks.map((task) => (
        <TaskCard
          key={task.taskId}
          task={task}
          onClick={() => setSelectedTask(task)}
        />
      ))}
    </div>
  );
}

/* ---------------- TASK CARD ---------------- */

function TaskCard({ task, onClick }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.taskId,
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onClick}
      className="rounded-xl border bg-white shadow-sm transition hover:shadow-md hover:-translate-y-[2px]"
    >
      <div
        {...listeners}
        {...attributes}
        className="cursor-grab px-3 py-2 border-b text-xs text-gray-900"
      >
        Drag
      </div>

      <div className="p-4 cursor-pointer">{task.title}</div>
    </div>
  );
}
