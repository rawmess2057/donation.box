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
  default: "bg-gradient-to-br from-primary/[0.04] via-transparent to-accent/[0.02] backdrop-blur-2xl border border-white/10",
  elevated: "bg-gradient-to-br from-primary/[0.04] via-transparent to-accent/[0.02] backdrop-blur-2xl border border-white/15 shadow-md",
  bordered: "bg-gradient-to-br from-primary/[0.04] via-transparent to-accent/[0.02] backdrop-blur-2xl border border-white/20",
  glow: "bg-gradient-to-br from-primary/[0.04] via-transparent to-accent/[0.02] backdrop-blur-2xl border border-white/10 shadow-[0_0_20px_rgba(127,191,127,0.12)]",
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
      className={`inline-block bg-white/[0.04] backdrop-blur-2xl border border-white/20 text-white px-6 py-2.5 rounded-full text-base no-underline cursor-pointer transition-all duration-500 ease-out shadow-[0_0_15px_rgba(127,191,127,0.15)] hover:shadow-[0_0_40px_rgba(127,191,127,0.3)] hover:border-primary/50 hover:bg-primary/15 hover:-translate-y-0.5 ${className}`}
      {...props}
    >
      {children}
    </a>
  );
};
