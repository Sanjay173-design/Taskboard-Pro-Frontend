import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppShell() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`
          ${collapsed ? "w-16" : "w-64"}
          border-r bg-white
          transition-all duration-300
          flex flex-col
        `}
      >
        <Sidebar collapsed={collapsed} />
      </aside>

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <header className="h-14 border-b bg-white flex items-center px-6">
          <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-6 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
