import type { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export function Textarea({ label, className = "", ...props }: TextareaProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      <textarea
        className={`min-h-32 w-full rounded-2xl border border-purple-100 bg-white/90 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 ${className}`}
        {...props}
      />
    </label>
  );
}
