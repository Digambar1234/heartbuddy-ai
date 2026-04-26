import type { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`luxe-panel rounded-2xl p-6 ${className}`}
      {...props}
    />
  );
}
