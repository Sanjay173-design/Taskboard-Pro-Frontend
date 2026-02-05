import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { apiFetch } from "../api/client";
import toast from "react-hot-toast";
import SkeletonCard from "../components/SkeletonCard";
import { motion } from "framer-motion";

export default function Workspaces() {
  const { accessToken } = useAuth();
  const [workspaces, setWorkspaces] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadWorkspaces = () => {
    setLoading(true);
    apiFetch("/workspaces", accessToken)
      .then(setWorkspaces)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadWorkspaces();
  }, [accessToken]);

  const createWorkspace = async () => {
    if (!name.trim()) return;

    await apiFetch("/workspaces", accessToken, {
      method: "POST",
      body: JSON.stringify({ name }),
    });
    toast.success("Workspace created");
    setName("");
    loadWorkspaces(); // backend cache invalidated
  };

  /* ---------------- Loading (Skeleton) ---------------- */
  if (loading) {
    return (
      <div className="max-w-3xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight">Workspaces</h1>

        <div className="p-8 grid gap-4 max-w-xl">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-8">
      {/* Header */}
      <h1 className="text-2xl font-semibold tracking-tight">Workspaces</h1>

      {/* Create workspace */}
      <div className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && createWorkspace()}
          placeholder="New workspace name"
          className="
            flex-1 rounded-xl border px-3 py-2
            bg-white text-gray-900 placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-black/20 transition
             hover:-translate-y-[2px]
          "
        />
        <button
          onClick={createWorkspace}
          className="
            px-4 py-2 rounded-xl bg-black text-white 
            hover:opacity-90 transition
  hover:shadow-md
  hover:-translate-y-[2px]
          "
        >
          Create
        </button>
      </div>

      {/* Workspace list */}
      {workspaces.length > 0 ? (
        <motion.ul className="grid gap-4">
          {workspaces.length === 0 && (
            <div className="rounded-xl border p-6 text-center text-gray-500">
              No workspaces yet
              <div className="text-sm mt-2">
                Create your first workspace to get started
              </div>
            </div>
          )}
          {workspaces.map((w) => (
            <li
              key={w.workspaceId}
              onClick={() =>
                navigate(`/app/projects?workspaceId=${w.workspaceId}`)
              }
              className="
    cursor-pointer
    rounded-xl
    border
    p-4
    bg-white
    shadow-sm
    transition
    hover:shadow-md
    hover:-translate-y-[2px]
  "
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">{w.name}</span>
                <span className="text-sm text-gray-400 group-hover:text-gray-600">
                  →
                </span>
              </div>
            </li>
          ))}
        </motion.ul>
      ) : (
        /* Empty state */
        <div className="rounded-xl border border-dashed p-8 text-center text-gray-500">
          <p className="font-medium">No workspaces yet</p>
          <p className="text-sm mt-1">
            Create your first workspace to get started
          </p>
        </div>
      )}
    </div>
  );
}
