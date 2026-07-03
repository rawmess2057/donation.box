"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import AnimatedNumber from "@/components/ui/AnimatedNumber";

interface ImpactCalculatorProps {
  impactDescription?: string;
  className?: string;
}

const CATEGORY_EMOJIS: Record<string, string> = {
  Education: "📚",
  Nutrition: "🍲",
  Health: "🏥",
  Environment: "🌳",
  Emergency: "🆘",
};

export default function ImpactCalculator({
  impactDescription,
  className = "",
}: ImpactCalculatorProps) {
  const [amount, setAmount] = useState(0.5);

  if (!impactDescription) return null;

  const sliderValue = Math.log10(amount * 100 + 1) * 50;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = Number(e.target.value);
    const computed = Math.round((Math.pow(10, raw / 50) - 1) * 100) / 100;
    setAmount(Math.max(0.01, Math.min(10, computed)));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`glass-surface rounded-2xl p-5 ${className}`}
    >
      <h3 className="text-sm font-bold text-fg mb-4 font-[family-name:var(--font-heading)]">
        See Your Impact
      </h3>

      <div className="text-center mb-4">
        <span className="text-4xl">💚</span>
      </div>

      <p className="text-sm text-center text-fg leading-relaxed mb-5 font-[family-name:var(--font-body)]">
        Your <span className="font-bold text-primary">{amount.toFixed(2)} SOL</span> provides:
        <br />
        <span className="font-semibold text-fg">{impactDescription}</span>
      </p>

      <input
        type="range"
        min="0"
        max="100"
        value={Math.round(sliderValue)}
        onChange={handleSliderChange}
        className="w-full h-2 bg-bg-muted rounded-full appearance-none cursor-pointer accent-primary
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary
          [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-grab
          [&::-webkit-slider-thumb]:active:cursor-grabbing"
        aria-label="Adjust donation amount to see impact"
      />

      <div className="flex justify-between text-[10px] text-fg-subtle mt-1">
        <span>0.01 SOL</span>
        <span>10 SOL</span>
      </div>
    </motion.div>
  );
}
