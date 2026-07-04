"use client";

import { motion } from "framer-motion";
import ProgressBar from "@/components/ui/ProgressBar";

interface Donor {
  address: string;
  amount: number;
}

interface RealTimeProgressVisualizerProps {
  raised: number;
  goal: number;
  recentDonors?: Donor[];
  className?: string;
}

export default function RealTimeProgressVisualizer({
  raised,
  goal,
  recentDonors = [],
  className = "",
}: RealTimeProgressVisualizerProps) {
  const milestoneLabels = [
    { at: 25, label: "25%" },
    { at: 50, label: "50%" },
    { at: 75, label: "75%" },
    { at: 100, label: "Goal!" },
  ];

  return (
    <div className={`glass-surface rounded-2xl p-5 space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-fg font-[family-name:var(--font-heading)]">
          Impact River
        </h3>
        <span className="text-xs text-fg-muted">
          {recentDonors.length} recent donor{recentDonors.length !== 1 ? "s" : ""}
        </span>
      </div>

      <ProgressBar
        value={raised}
        max={goal}
        milestones={milestoneLabels}
      />

      {recentDonors.length > 0 && (
        <div className="flex -space-x-2 overflow-hidden pt-1">
          {recentDonors.slice(0, 5).map((donor, i) => (
            <motion.div
              key={donor.address + i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent text-white text-[10px] font-bold border-2 border-bg-card"
              title={`${donor.address.slice(0, 4)}...${donor.address.slice(-4)} — ${donor.amount} SOL`}
            >
              {donor.address.slice(2, 4).toUpperCase()}
            </motion.div>
          ))}
          {recentDonors.length > 5 && (
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-bg-muted text-fg-subtle text-[10px] font-bold border-2 border-bg-card">
              +{recentDonors.length - 5}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
