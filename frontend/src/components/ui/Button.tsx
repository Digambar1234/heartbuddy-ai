import type { ButtonHTMLAttributes, ReactNode } from "react";

const variants = {
  primary: "bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 text-white shadow-glow hover:brightness-105",
  secondary: "bg-white/86 text-[#4c1d95] ring-1 ring-purple-100 hover:bg-white shadow-sm",
  ghost: "text-[#5b21b6] hover:bg-white/70",
  danger: "bg-rose-600 text-white hover:bg-rose-700",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  icon?: ReactNode;
}

export function Button({ className = "", variant = "primary", icon, children, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
