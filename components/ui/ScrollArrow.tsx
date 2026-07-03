"use client";

import { motion } from "framer-motion";

export default function ScrollArrow() {
  return (
    <motion.div
      className="group rounded-full border-2 border-white/15 bg-white/[0.04] backdrop-blur-xl p-2 cursor-pointer"
      animate={{ y: [0, 8, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      whileHover={{ scale: 1.15, borderColor: "rgba(127,191,127,0.4)", backgroundColor: "rgba(127,191,127,0.12)" }}
      whileTap={{ scale: 0.95 }}
      onClick={() =>
        document
          .getElementById("hero-next")
          ?.scrollIntoView({ behavior: "smooth" })
      }
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          document
            .getElementById("hero-next")
            ?.scrollIntoView({ behavior: "smooth" });
        }
      }}
      aria-label="Scroll to next section"
    >
      <svg
        className="h-5 w-5 text-fg-subtle group-hover:text-primary"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 14l-7 7m0 0l-7-7m7 7V3"
        />
      </svg>
    </motion.div>
  );
}
