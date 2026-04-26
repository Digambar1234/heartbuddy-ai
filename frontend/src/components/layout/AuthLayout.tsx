import { Heart } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="premium-bg flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[1fr_440px] lg:items-center">
        <div className="hidden lg:block">
          <div className="hero-sheen rounded-[2rem] p-6 shadow-glow">
            <img src="/assets/heartbuddy-3d-companion.png" alt="HeartBuddy AI companion visual" className="aspect-[4/3] w-full rounded-[1.5rem] object-cover" />
          </div>
          <p className="mt-5 text-sm font-semibold text-purple-900/70">
            HeartBuddy AI provides emotional support and companionship, but it is not a medical, therapeutic, or emergency service.
          </p>
        </div>
        <div className="w-full">
        <Link to="/" className="mb-8 flex items-center justify-center gap-3 text-xl font-black text-purple-950">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-rose-500 text-white shadow-glow">
            <Heart className="h-5 w-5" />
          </span>
          HeartBuddy AI
        </Link>
        {children}
        </div>
      </div>
    </main>
  );
}
