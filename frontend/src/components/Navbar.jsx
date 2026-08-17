import { LogOut, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar({ onMenuClick, title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-charcoal-100 bg-white/90 px-4 py-3.5 backdrop-blur lg:px-6">
      <div className="flex items-center gap-3">
        <button
          className="rounded-lg p-2 text-charcoal-500 hover:bg-charcoal-50 lg:hidden"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="font-display text-lg font-semibold text-charcoal-900">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-charcoal-800">{user?.name}</p>
          <p className="text-xs text-charcoal-400">{user?.email}</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-forge-600 text-sm font-semibold text-white">
          {user?.name?.[0]?.toUpperCase() || "U"}
        </div>
        <button
          onClick={handleLogout}
          className="rounded-lg p-2 text-charcoal-500 hover:bg-charcoal-50"
          aria-label="Log out"
          title="Log out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
