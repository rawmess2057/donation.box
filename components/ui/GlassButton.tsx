"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

type GlassButtonVariant = "primary" | "accent" | "ghost";
type GlassButtonSize = "sm" | "md" | "lg";

interface GlassButtonProps {
  variant?: GlassButtonVariant;
  size?: GlassButtonSize;
  glow?: boolean;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
}

const SIZE_STYLES: Record<GlassButtonSize, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

const VARIANT_STYLES: Record<GlassButtonVariant, string> = {
  primary:
    "bg-white/[0.04] backdrop-blur-2xl border border-white/20 text-white shadow-[0_0_15px_rgba(127,191,127,0.15)] hover:shadow-[0_0_40px_rgba(127,191,127,0.3)] hover:border-primary/50 hover:bg-primary/15",
  accent:
    "bg-white/[0.04] backdrop-blur-2xl border border-white/20 text-accent shadow-[0_0_15px_rgba(3,225,255,0.1)] hover:shadow-[0_0_40px_rgba(3,225,255,0.25)] hover:border-accent/50 hover:text-white hover:bg-accent/15",
  ghost:
    "bg-white/[0.04] backdrop-blur-2xl border border-white/10 text-fg-muted hover:text-white hover:bg-white/10 hover:border-white/20",
};

export default function GlassButton({
  variant = "primary",
  size = "md",
  glow = false,
  loading = false,
  disabled = false,
  className = "",
  children,
  onClick,
  type = "button",
}: GlassButtonProps) {
  return (
    <motion.button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.97 } : {}}
      className={[
        "relative inline-flex items-center justify-center gap-2 rounded-xl font-semibold",
        "backdrop-blur-xl saturate-[1.8] border transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
        SIZE_STYLES[size],
        VARIANT_STYLES[variant],
        glow && !disabled && "shadow-[0_0_20px_var(--glass-glow)]",
        disabled && "opacity-40 cursor-not-allowed",
        loading && "cursor-wait",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin shrink-0" />}
      <span className={loading ? "opacity-70" : ""}>{children}</span>
    </motion.button>
  );
}
