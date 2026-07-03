"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface GlassModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function GlassModal({
  open,
  onClose,
  title,
  children,
  className = "",
}: GlassModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-md"
            onClick={(e) => {
              if (e.target === overlayRef.current) onClose();
            }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={[
              "relative w-full max-w-lg rounded-2xl overflow-hidden",
              "backdrop-blur-xl saturate-[1.8] border",
              "bg-white/8 dark:bg-black/40",
              "border-white/15 dark:border-white/10",
              "shadow-[0_25px_50px_-12px_rgba(0,0,0,0.3)]",
              className,
            ].join(" ")}
          >
            {title && (
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/10 dark:border-white/5">
                <h2 className="text-lg font-bold text-fg font-[family-name:var(--font-heading)]">
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  aria-label="Close"
                >
                  <X size={16} className="text-fg-muted" />
                </button>
              </div>
            )}

            {!title && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <X size={16} className="text-fg-muted" />
              </button>
            )}

            <div className="p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
