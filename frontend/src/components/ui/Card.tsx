import type { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border border-white/70 bg-white/78 p-6 shadow-xl shadow-purple-950/10 backdrop-blur ${className}`}
      {...props}
    />
  );
}
