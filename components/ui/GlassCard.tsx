"use client";

import Glass from "@/components/ui/Glass";
import type { GlassVariant, BlurIntensity } from "@/components/ui/Glass";
import { motion } from "framer-motion";

interface GlassCardProps {
  variant?: GlassVariant;
  blur?: BlurIntensity;
  liquidIntensity?: "subtle" | "medium" | "intense" | "none";
  interactive?: boolean;
  glow?: boolean;
  className?: string;
  children: React.ReactNode;
}

export default function GlassCard({
  variant = "medium",
  blur = "md",
  liquidIntensity = "medium",
  interactive = false,
  glow = false,
  className = "",
  children,
}: GlassCardProps) {
  const Component = interactive ? motion.div : "div";
  const motionProps = interactive
    ? {
        whileHover: { y: -4, scale: 1.005 },
        transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const },
      }
    : {};

  return (
    <Component {...motionProps}>
      <Glass
        variant={variant}
        blur={blur}
        liquidIntensity={liquidIntensity}
        interactive={false}
        className={[
          "p-6",
          glow && "shadow-[0_0_30px_var(--glass-glow)]",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </Glass>
    </Component>
  );
}

GlassCard.Header = function GlassCardHeader({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mb-4 font-[family-name:var(--font-heading)] ${className}`}>
      {children}
    </div>
  );
};

GlassCard.Content = function GlassCardContent({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`${className}`}>{children}</div>;
};

GlassCard.Actions = function GlassCardActions({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mt-5 flex flex-wrap items-center gap-3 pt-4 border-t border-[var(--glass-border-light)] dark:border-[var(--glass-border-dark)] ${className}`}>
      {children}
    </div>
  );
};
