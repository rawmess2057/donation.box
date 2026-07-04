"use client";

import { useState } from "react";

interface GlassInputProps {
  label?: string;
  error?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: "text" | "number" | "url" | "email";
  leftIcon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export default function GlassInput({
  label,
  error,
  placeholder,
  value,
  onChange,
  type = "text",
  leftIcon,
  disabled = false,
  className = "",
}: GlassInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-[11px] font-semibold uppercase tracking-wide text-fg-muted">
          {label}
        </label>
      )}

      <div
        className={[
          "relative flex items-center rounded-xl transition-all duration-200",
          "backdrop-blur-xl saturate-[1.8] border",
          "bg-white/5",
          focused
            ? "border-primary/50 shadow-[0_0_12px_rgba(127,191,127,0.1)]"
            : error
              ? "border-red-400/50"
              : "border-white/15",
        ].join(" ")}
      >
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-subtle pointer-events-none">
            {leftIcon}
          </span>
        )}

        <input
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          className={[
            "w-full bg-transparent px-4 py-3 text-sm text-fg outline-none placeholder:text-fg-subtle/60",
            "font-[family-name:var(--font-heading)]",
            leftIcon && "pl-10",
            disabled && "opacity-40 cursor-not-allowed",
          ].join(" ")}
        />
      </div>

      {error && (
        <p className="text-xs text-red-400 font-medium px-1">{error}</p>
      )}
    </div>
  );
}
