import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { apiFetch } from "../api/client";

export default function ActivityFeed() {
  const { accessToken } = useAuth();

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- LOAD ALL ACTIVITY ---------------- */

  useEffect(() => {
    const loadActivity = async () => {
      try {
        // 1️⃣ Workspaces
        const workspaces = await apiFetch("/workspaces", accessToken);

        if (!workspaces?.length) {
          setActivities([]);
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
          setActivities([]);
          return;
        }

        // 3️⃣ Tasks
        const tasksNested = await Promise.all(
          projects.map((p) =>
            apiFetch(`/tasks?projectId=${p.projectId}`, accessToken),
          ),
        );

        const tasks = tasksNested.flat();

        if (!tasks.length) {
          setActivities([]);
          return;
        }

        // 4️⃣ Activity per task
        const activityNested = await Promise.all(
          tasks.map((t) =>
            apiFetch(`/tasks/activity?taskId=${t.taskId}`, accessToken),
          ),
        );

        const allActivity = activityNested.flat();

        // Sort newest first
        allActivity.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );

        setActivities(allActivity);
      } catch (err) {
        console.error("Activity load failed", err);
      } finally {
        setLoading(false);
      }
    };

    loadActivity();
  }, [accessToken]);

  /* ---------------- UI ---------------- */

  if (loading) {
    return <div className="p-8">Loading activity…</div>;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">Activity Feed</h1>

      <div className="space-y-3">
        {activities.length === 0 && (
          <div className="text-gray-500">No activity yet</div>
        )}

        {activities.map((a) => (
          <ActivityItem key={a.activityId} activity={a} />
        ))}
      </div>
    </div>
  );
}

/* ---------------- ACTIVITY ITEM ---------------- */

function ActivityItem({ activity }) {
  return (
    <div className="rounded-xl border p-4 bg-white shadow-sm">
      <div className="flex justify-between items-start">
        <div className="text-sm">{activity.message}</div>

        <div className="text-xs text-gray-400">
          {new Date(activity.createdAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
