"use client";

import { motion } from "framer-motion";
import Glass from "@/components/ui/Glass";

type CardVariant = "default" | "elevated" | "bordered" | "glow" | "glass";

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
  liquidIntensity?: "subtle" | "medium" | "intense" | "none";
  reflection?: boolean;
  glow?: boolean;
}

const variantStyles: Record<string, string> = {
  default: "bg-bg-card border border-primary/10 shadow-sm",
  elevated: "bg-bg-card border border-primary/10 shadow-md",
  bordered: "bg-bg-card border border-primary/20",
  glow: "bg-bg-card border border-primary/10 shadow-lg shadow-glow",
};

export default function Card({
  children,
  variant = "default",
  className = "",
  hoverable = false,
  onClick,
  liquidIntensity = "none",
  reflection = true,
  glow = false,
}: CardProps) {
  if (variant === "glass") {
    return (
      <motion.div
        whileHover={hoverable ? { y: -4, scale: 1.01 } : undefined}
        transition={
          hoverable
            ? { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
            : undefined
        }
        onClick={onClick}
        className={hoverable ? "cursor-pointer" : ""}
      >
        <Glass
          variant="medium"
          liquidIntensity={liquidIntensity}
          reflection={reflection}
          glowColor={glow ? "rgba(127, 191, 127, 0.15)" : undefined}
          className={`p-6 ${className}`}
        >
          {children}
        </Glass>
      </motion.div>
    );
  }

  const Component = hoverable ? motion.div : "div";
  const motionProps = hoverable
    ? {
        whileHover: { y: -4, scale: 1.01 } as const,
        transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } as const,
      }
    : {};

  return (
    <Component
      className={`rounded-2xl p-6 transition-shadow duration-300 ${variantStyles[variant]} ${hoverable ? "cursor-pointer" : ""} ${className}`}
      onClick={onClick}
      {...motionProps}
    >
      {children}
    </Component>
  );
}

Card.Button = function CardButton({
  children,
  className = "",
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={`inline-block bg-white/15 hover:bg-white/25 border border-white/30 hover:border-white/50 text-white px-6 py-2.5 rounded-full text-base no-underline cursor-pointer transition-all duration-300 hover:-translate-y-0.5 ${className}`}
      {...props}
    >
      {children}
    </a>
  );
};
