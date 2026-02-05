import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { apiFetch } from "../api/client";

import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const { accessToken } = useAuth();
  const [tasks, setTasks] = useState([]);

  /* ---------------- LOAD DATA ---------------- */

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // 1️⃣ Workspaces
        const workspaces = await apiFetch("/workspaces", accessToken);

        if (!workspaces?.length) {
          setTasks([]);
          return;
        }

        // 2️⃣ Projects
        const projectsNested = await Promise.all(
          workspaces.map((w) =>
            apiFetch(`/projects?workspaceId=${w.workspaceId}`, accessToken),
          ),
        );

        const projects = projectsNested.flat();

        if (!projects.length) {
          setTasks([]);
          return;
        }

        // 3️⃣ Tasks
        const tasksNested = await Promise.all(
          projects.map((p) =>
            apiFetch(`/tasks?projectId=${p.projectId}`, accessToken),
          ),
        );

        setTasks(tasksNested.flat());
      } catch (err) {
        console.error("Dashboard load failed", err);
      }
    };

    loadDashboardData();
  }, [accessToken]);

  /* ---------------- STATS ---------------- */

  const now = new Date();

  const stats = {
    total: tasks.length,
    done: tasks.filter((t) => t.status === "done").length,
    inProgress: tasks.filter((t) => t.status === "in_progress").length,
    overdue: tasks.filter(
      (t) => t.dueDate && new Date(t.dueDate) < now && t.status !== "done",
    ).length,
    highPriority: tasks.filter((t) => ["high", "urgent"].includes(t.priority))
      .length,
  };

  /* ---------------- CHART DATA ---------------- */

  const chartData = [
    { name: "Todo", value: tasks.filter((t) => t.status === "todo").length },
    {
      name: "In Progress",
      value: tasks.filter((t) => t.status === "in_progress").length,
    },
    { name: "Done", value: tasks.filter((t) => t.status === "done").length },
  ];

  const COLORS = ["#9CA3AF", "#3B82F6", "#10B981"];
  /* ---------------- COMPLETION TREND ---------------- */

  const completionMap = {};

  tasks.forEach((t) => {
    if (t.status === "done" && t.updatedAt) {
      const day = new Date(t.updatedAt).toLocaleDateString();

      if (!completionMap[day]) completionMap[day] = 0;
      completionMap[day]++;
    }
  });

  const completionTrend = Object.entries(completionMap)
    .map(([date, count]) => ({
      date,
      count,
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  /* ---------------- Dashboard.jsx ---------------- */
  const dueToday = tasks.filter((t) => {
    if (!t.dueDate || t.status === "done") return false;

    const today = new Date().toDateString();
    return new Date(t.dueDate).toDateString() === today;
  }).length;

  const overdueCount = tasks.filter((t) => {
    if (!t.dueDate || t.status === "done") return false;

    return new Date(t.dueDate) < new Date();
  }).length;

  /* ---------------- UI ---------------- */

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>

      {/* ALERT BANNERS */}

      <div className="space-y-2">
        {overdueCount > 0 && (
          <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 transition hover:shadow-md hover:-translate-y-[2px]">
            ⚠ {overdueCount} task{overdueCount > 1 ? "s" : ""} overdue
          </div>
        )}

        {dueToday > 0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 text-amber-700 px-4 py-3 transition hover:shadow-md hover:-translate-y-[2px]">
            ⚡ {dueToday} task{dueToday > 1 ? "s" : ""} due today
          </div>
        )}
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Total Tasks" value={stats.total} />
        <StatCard label="Completed" value={stats.done} />
        <StatCard label="In Progress" value={stats.inProgress} />
        <StatCard label="Overdue" value={stats.overdue} />
        <StatCard label="High Priority" value={stats.highPriority} />
      </div>

      {/* CHART */}
      <div className="rounded-2xl border p-6 bg-white shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Tasks by Status</h2>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Completion Trend Chart */}
      <div className="rounded-2xl border p-6 bg-white shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Tasks Completed Per Day</h2>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={completionTrend}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="count"
                stroke="#3B82F6"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* ---------------- CARD COMPONENT ---------------- */

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border p-4 bg-white shadow-sm">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-3xl font-semibold mt-2">{value}</div>
    </div>
  );
}
