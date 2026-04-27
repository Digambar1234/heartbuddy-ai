import { BarChart3, Brain, Heart, Home, LogOut, MessageCircle, Settings } from "lucide-react";
import type { ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import { useAuthStore } from "../../store/authStore";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/chat", label: "Chat", icon: MessageCircle },
  { to: "/memories", label: "Memories", icon: Brain },
  { to: "/mood", label: "Mood", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function AppLayout({ children, fullWidth = false }: { children: ReactNode; fullWidth?: boolean }) {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  return (
    <div className="premium-bg min-h-screen">
      <header className="sticky top-0 z-40 border-b border-white/70 bg-white/78 backdrop-blur-xl">
        <div className={`mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-4 ${fullWidth ? "max-w-7xl" : "max-w-6xl"}`}>
          <Link to="/dashboard" className="flex items-center gap-3 text-lg font-black text-purple-950">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-rose-500 to-indigo-600 text-white shadow-glow">
              <Heart className="h-5 w-5" />
            </span>
            HeartBuddy AI
          </Link>
          <nav className="flex max-w-full flex-1 items-center justify-end gap-1 overflow-x-auto rounded-2xl border border-white/70 bg-white/50 p-1 shadow-sm md:flex-none">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                title={item.label}
                className={({ isActive }) => `inline-flex h-10 shrink-0 items-center gap-2 rounded-xl px-3 text-sm font-semibold transition ${isActive ? "bg-purple-700 text-white shadow-sm" : "text-purple-900 hover:bg-white/80"}`}
              >
                <item.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </NavLink>
            ))}
            <Button
              variant="secondary"
              title="Logout"
              icon={<LogOut className="h-4 w-4" />}
              className="shrink-0 px-3 sm:px-5"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </nav>
        </div>
      </header>
      <main className={`mx-auto px-4 py-8 ${fullWidth ? "max-w-7xl" : "max-w-6xl"}`}>{children}</main>
    </div>
  );
}
