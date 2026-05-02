"use client";

import { cn } from "@/shared/lib/utils";

interface FilterSelectProps {
  label: string;
  value: string | null;
  options: { value: string; label: string }[];
  onChange: (value: string | null) => void;
  className?: string;
}

export function FilterSelect({
  label,
  value,
  options,
  onChange,
  className,
}: FilterSelectProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    onChange(val === "" ? null : val);
  };

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label className="text-text-secondary text-xs font-medium">{label}</label>
      <div className="relative">
        <select
          value={value ?? ""}
          onChange={handleChange}
          className={cn(
            "border-border bg-input-bg h-10 w-full appearance-none rounded-lg border px-3 pr-10",
            "text-text-primary text-sm",
            "transition-colors",
            "focus:border-brand focus:ring-brand/20 focus:ring-2 focus:outline-none",
            value && "font-medium",
          )}
        >
          <option value="">Todos</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {/* Chevron icon */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-text-secondary"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </div>
    </div>
  );
}

interface FilterButtonProps {
  label: string;
  onClick: () => void;
  isActive?: boolean;
  count?: number;
  className?: string;
}

export function FilterButton({
  label,
  onClick,
  isActive = false,
  count,
  className,
}: FilterButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-9 items-center gap-2 rounded-full border px-4 text-sm font-medium",
        "transition-colors",
        isActive
          ? "border-brand bg-brand text-white"
          : "border-border bg-card text-text-primary hover:border-text-secondary",
        className,
      )}
    >
      {label}
      {count !== undefined && (
        <span
          className={cn(
            "flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs",
            isActive ? "bg-white/20" : "bg-surface text-text-secondary",
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}
