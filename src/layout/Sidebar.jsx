import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Folder,
  CheckSquare,
  Activity,
} from "lucide-react";

export default function Sidebar({ collapsed }) {
  const base =
    "flex items-center rounded-lg text-sm font-medium transition hover:-translate-y-[2px]";

  return (
    <nav className="p-2 space-y-2">
      <SidebarItem
        to="/app/dashboard"
        icon={LayoutDashboard}
        label="Dashboard"
        collapsed={collapsed}
        base={base}
      />

      <SidebarItem
        to="/app/workspaces"
        icon={FolderKanban}
        label="Workspaces"
        collapsed={collapsed}
        base={base}
      />

      <SidebarItem
        to="/app/projects"
        icon={Folder}
        label="Projects"
        collapsed={collapsed}
        base={base}
      />

      <SidebarItem
        to="/app/tasks"
        icon={CheckSquare}
        label="Tasks"
        collapsed={collapsed}
        base={base}
      />

      <SidebarItem
        to="/app/activity"
        icon={Activity}
        label="Activity"
        collapsed={collapsed}
        base={base}
      />
    </nav>
  );
}

/* ---------------- ITEM ---------------- */

function SidebarItem({ to, icon: Icon, label, collapsed, base }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `
        ${base}
        ${collapsed ? "justify-center p-3" : "gap-3 px-4 py-2"}
        ${isActive ? "bg-black text-white shadow-sm" : "hover:bg-gray-100"}
        `
      }
    >
      <Icon size={20} strokeWidth={2} />
      {!collapsed && <span>{label}</span>}
    </NavLink>
  );
}
