import { Heart } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="premium-bg flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-3 text-xl font-black text-purple-950">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-rose-500 text-white shadow-glow">
            <Heart className="h-5 w-5" />
          </span>
          HeartBuddy AI
        </Link>
        {children}
      </div>
    </main>
  );
}
