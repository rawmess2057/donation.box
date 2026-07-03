"use client";

import { motion, AnimatePresence } from "framer-motion";

interface DonationMomentProps {
  amount: number;
  donorName: string;
  show: boolean;
  onComplete?: () => void;
}

export default function DonationMoment({
  amount,
  donorName,
  show,
  onComplete,
}: DonationMomentProps) {
  return (
    <AnimatePresence onExitComplete={onComplete}>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-2xl bg-bg-card border border-accent/30 shadow-lg shadow-glow-accent p-4"
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-accent/10"
              initial={{ scale: 0 }}
              animate={{ scale: 4 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>

          <div className="relative z-10 flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white text-sm font-bold shrink-0"
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </motion.div>

            <div>
              <p className="text-sm font-bold text-fg">
                {donorName}
              </p>
              <motion.p
                className="text-lg font-bold text-primary tabular-nums"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                +{amount.toFixed(2)} SOL
              </motion.p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
