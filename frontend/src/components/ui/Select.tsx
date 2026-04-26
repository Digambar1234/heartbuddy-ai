import type { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Array<{ value: string; label: string }>;
}

export function Select({ label, options, className = "", ...props }: SelectProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      <select
        className={`w-full rounded-2xl border border-purple-100 bg-white/90 px-4 py-3 text-slate-900 outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100 ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
