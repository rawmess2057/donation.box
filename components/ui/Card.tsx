"use client";

import { motion } from "framer-motion";

type CardVariant = "default" | "elevated" | "bordered" | "glow" | "glass";

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

const variantStyles: Record<CardVariant, string> = {
  default: "bg-bg-card shadow-sm",
  elevated: "bg-bg-card shadow-md",
  bordered: "bg-bg-card border border-border",
  glow: "bg-bg-card shadow-lg shadow-glow",
  glass: "glass-card",
};

export default function Card({
  children,
  variant = "default",
  className = "",
  hoverable = false,
  onClick,
}: CardProps) {
  const Component = hoverable ? motion.div : "div";
  const motionProps = hoverable
    ? {
        whileHover: { y: -4, scale: 1.01 },
        transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const },
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
