import { BarChart3, Brain, Heart, Home, LogOut, MessageCircle, Settings } from "lucide-react";
import type { ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import { useAuthStore } from "../../store/authStore";

export function AppLayout({ children, fullWidth = false }: { children: ReactNode; fullWidth?: boolean }) {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  return (
    <div className="premium-bg min-h-screen">
      <header className="sticky top-0 z-40 border-b border-white/70 bg-white/72 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <Link to="/dashboard" className="flex items-center gap-3 text-lg font-black text-purple-950">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-rose-500 text-white">
              <Heart className="h-5 w-5" />
            </span>
            HeartBuddy AI
          </Link>
          <nav className="flex flex-wrap items-center gap-1 rounded-2xl border border-white/70 bg-white/45 p-1 shadow-sm">
            <NavLink
              to="/dashboard"
              className={({ isActive }) => `inline-flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold transition ${isActive ? "bg-purple-700 text-white shadow-sm" : "text-purple-900 hover:bg-white/80"}`}
            >
              <Home className="h-4 w-4" />
              Dashboard
            </NavLink>
            <NavLink
              to="/chat"
              className={({ isActive }) => `inline-flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold transition ${isActive ? "bg-purple-700 text-white shadow-sm" : "text-purple-900 hover:bg-white/80"}`}
            >
              <MessageCircle className="h-4 w-4" />
              Chat
            </NavLink>
            <NavLink
              to="/memories"
              className={({ isActive }) => `inline-flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold transition ${isActive ? "bg-purple-700 text-white shadow-sm" : "text-purple-900 hover:bg-white/80"}`}
            >
              <Brain className="h-4 w-4" />
              Memories
            </NavLink>
            <NavLink
              to="/mood"
              className={({ isActive }) => `inline-flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold transition ${isActive ? "bg-purple-700 text-white shadow-sm" : "text-purple-900 hover:bg-white/80"}`}
            >
              <BarChart3 className="h-4 w-4" />
              Mood
            </NavLink>
            <NavLink
              to="/settings"
              className={({ isActive }) => `inline-flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold transition ${isActive ? "bg-purple-700 text-white shadow-sm" : "text-purple-900 hover:bg-white/80"}`}
            >
              <Settings className="h-4 w-4" />
              Settings
            </NavLink>
            <Button
              variant="secondary"
              icon={<LogOut className="h-4 w-4" />}
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              Logout
            </Button>
          </nav>
        </div>
      </header>
      <main className={`mx-auto px-4 py-8 ${fullWidth ? "max-w-7xl" : "max-w-6xl"}`}>{children}</main>
    </div>
  );
}
