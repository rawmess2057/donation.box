"use client";

import { useEffect, useRef } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

interface AnimatedNumberProps {
  from?: number;
  to: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
  format?: boolean;
}

export default function AnimatedNumber({
  from = 0,
  to,
  suffix = "",
  prefix = "",
  decimals = 0,
  className = "",
  format = true,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const spring = useSpring(from, { stiffness: 50, damping: 20 });
  const display = useTransform(spring, (v) => {
    let val = v.toFixed(decimals);
    if (format) {
      val = Number(val).toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
    }
    return `${prefix}${val}${suffix}`;
  });

  useEffect(() => {
    spring.set(to);
  }, [to, spring]);

  return (
    <motion.span ref={ref} className={`tabular-nums ${className}`}>
      {display}
    </motion.span>
  );
}
