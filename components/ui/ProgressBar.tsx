"use client";

import { motion } from "framer-motion";

interface Milestone {
  at: number;
  label: string;
}

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  showPercentage?: boolean;
  milestones?: Milestone[];
  className?: string;
  color?: string;
}

export default function ProgressBar({
  value,
  max,
  label,
  showPercentage = true,
  milestones,
  className = "",
  color,
}: ProgressBarProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100);
  const barColor = color || "bg-gradient-to-r from-primary via-accent to-success";

  return (
    <div className={`space-y-2 ${className}`}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-sm">
          {label && <span className="font-medium text-fg">{label}</span>}
          {showPercentage && (
            <span className="font-semibold text-fg-muted tabular-nums">
              {percentage}%
            </span>
          )}
        </div>
      )}

      <div className="relative h-3 bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-full overflow-hidden">
        <motion.div
          className={`absolute inset-y-0 left-0 rounded-full ${barColor} animate-river-flow`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />

        {milestones?.map((m, i) => {
          if (m.at > percentage) return null;
          return (
            <div
              key={i}
              className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white/20 backdrop-blur-xl border-2 border-accent rounded-full shadow-md flex items-center justify-center"
              style={{ left: `${m.at}%`, marginLeft: "-10px" }}
              title={m.label}
            >
              <div className="w-2 h-2 bg-accent rounded-full" />
            </div>
          );
        })}
      </div>

      {milestones && (
        <div className="flex justify-between text-xs text-fg-subtle px-0.5">
          {milestones.map((m, i) => (
            <span key={i}>{m.at >= percentage ? m.label : m.label}</span>
          ))}
        </div>
      )}
    </div>
  );
}
