import { Menu } from "lucide-react";
import { useAuth } from "../auth/AuthContext";

export default function Header({ collapsed, setCollapsed }) {
  const { logout } = useAuth();

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-3 bg-bl">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className=" border p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <Menu size={20} />
        </button>

        <h1 className="text-2xl font-semibold">TaskBoard Pro</h1>
      </div>

      <button
        onClick={logout}
        className="text-sm px-4 py-2 rounded-md bg-black text-white transition hover:shadow-md hover:-translate-y-[2px]"
      >
        Logout
      </button>
    </div>
  );
}
