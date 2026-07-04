"use client";

import { useMemo } from "react";

export type GlassVariant = "light" | "medium" | "heavy" | "interactive";
export type BlurIntensity = "sm" | "md" | "lg";

interface GlassProps {
  variant?: GlassVariant;
  blur?: BlurIntensity;
  opacity?: number;
  liquidIntensity?: "subtle" | "medium" | "intense" | "none";
  reflection?: boolean;
  interactive?: boolean;
  glowColor?: string;
  className?: string;
  children: React.ReactNode;
  as?: "div" | "section" | "aside" | "article" | "nav";
}

const BLUR_MAP: Record<BlurIntensity, string> = {
  sm: "blur(8px)",
  md: "blur(16px)",
  lg: "blur(24px)",
};

const VARIANT_OPACITY: Record<GlassVariant, number> = {
  light: 0.06,
  medium: 0.08,
  heavy: 0.12,
  interactive: 0.07,
};

const VARIANT_BORDER: Record<GlassVariant, string> = {
  light: "rgba(127, 191, 127, 0.06)",
  medium: "rgba(127, 191, 127, 0.1)",
  heavy: "rgba(127, 191, 127, 0.12)",
  interactive: "rgba(127, 191, 127, 0.08)",
};

const LIQUID_FILTER: Record<string, string> = {
  none: "",
  subtle: "url(#glass-subtle)",
  medium: "url(#glass-liquid)",
  intense: "url(#glass-intense)",
};

export default function Glass({
  variant = "medium",
  blur = "md",
  opacity,
  liquidIntensity = "none",
  reflection = true,
  interactive = false,
  glowColor,
  className = "",
  children,
  as: Component = "div",
}: GlassProps) {
  const style = useMemo(() => {
    const varOp = VARIANT_OPACITY[variant];
    const varBorder = VARIANT_BORDER[variant];
    const b = BLUR_MAP[blur];
    const filter = LIQUID_FILTER[liquidIntensity];

    return {
      "--glass-blur": b,
      "--glass-opacity": varOp,
      "--glass-border": varBorder,
      "--glass-filter": filter,
      "--glass-glow": glowColor ?? "rgba(127, 191, 127, 0.1)",
    } as React.CSSProperties;
  }, [variant, blur, opacity, liquidIntensity, glowColor]);

  return (
    <Component
      style={style}
      className={[
        "rounded-2xl relative overflow-hidden",
        "bg-[rgba(255,255,255,var(--glass-opacity))]",
        "backdrop-filter-[var(--glass-blur)] saturate-[1.8]",
        "border border-[var(--glass-border)]",
        liquidIntensity !== "none" && "liquid-glass",
        interactive && "cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...(interactive ? { tabIndex: 0, role: "button" } : {})}
    >
      {liquidIntensity !== "none" && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ filter: "var(--glass-filter)" }}
          aria-hidden="true"
        />
      )}
      {reflection && (
        <div
          className="absolute inset-x-0 top-0 h-1/2 pointer-events-none rounded-t-2xl z-[1]"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.04) 40%, transparent 100%)",
          }}
          aria-hidden="true"
        />
      )}
      <div className="relative z-[2]" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.12)" }}>
        {children}
      </div>
    </Component>
  );
}
