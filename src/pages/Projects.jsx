import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { apiFetch } from "../api/client";

export default function Projects() {
  const { accessToken } = useAuth();
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [params] = useSearchParams();
  const workspaceId = params.get("workspaceId");
  const navigate = useNavigate();

  const loadProjects = () => {
    apiFetch(`/projects?workspaceId=${workspaceId}`, accessToken).then(
      setProjects,
    );
  };

  useEffect(() => {
    if (!workspaceId) {
      navigate("/app/workspaces");
      return;
    }

    loadProjects();
  }, [workspaceId, accessToken]);

  const createProject = async () => {
    if (!name.trim()) return;

    await apiFetch("/projects", accessToken, {
      method: "POST",
      body: JSON.stringify({ name, workspaceId }),
    });
    toast.success("Project created");
    setName("");
    loadProjects();
  };

  if (!workspaceId) {
    return <div className="p-10">Workspace not selected</div>;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>

      {/* Create project */}
      <div className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New project name"
          className="flex-1 border rounded-lg px-3 py-2 transition
             hover:-translate-y-[2px]"
        />
        <button
          onClick={createProject}
          className="px-4 py-2 rounded-lg bg-black text-white transition
  hover:shadow-md
  hover:-translate-y-[2px]"
        >
          Create
        </button>
      </div>

      {/* Project list */}
      <ul className="grid gap-4">
        {projects.length === 0 && (
          <div className="rounded-xl border p-8 text-center text-gray-500">
            No projects yet
            <div className="text-sm mt-2">
              Create your first project in this workspace
            </div>
          </div>
        )}

        {projects.map((p) => (
          <li
            key={p.projectId}
            onClick={() => navigate(`/app/tasks?projectId=${p.projectId}`)}
            className="
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
            {p.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
