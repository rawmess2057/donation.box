"use client";

import { useEffect, useRef } from "react";
import { motion, type Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const textVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 100, damping: 14 },
  },
};

const glassCard =
  "bg-gradient-to-br from-primary/[0.06] via-transparent to-accent/[0.04] backdrop-blur-2xl border border-white/10 rounded-3xl";

export default function VideoShowcaseSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative px-4 py-24 overflow-hidden">
      {/* Background shapes */}
      <motion.div
        className="absolute top-[10%] left-[3%] w-[160px] h-[160px] pointer-events-none z-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(127,191,127,0.1), rgba(127,191,127,0.03))",
          clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
        }}
        animate={{ x: [0, -12, 8, 0], y: [0, 10, -6, 0], rotate: [0, 5, -3, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[15%] right-[2%] w-[180px] h-[140px] pointer-events-none z-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(3,225,255,0.07), rgba(220,31,255,0.03))",
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
        }}
        animate={{ x: [0, 14, -6, 0], y: [0, -8, 10, 0], rotate: [0, -4, 2, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      />

      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-b from-transparent to-bg pointer-events-none z-[1]" />

      <motion.div
        className="relative max-w-5xl mx-auto z-[2]"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.h2
          variants={textVariants}
          className="text-3xl md:text-5xl font-bold text-center font-[family-name:var(--font-heading)]"
        >
          See{" "}
          <span
            className="bg-gradient-to-r from-primary via-accent to-success bg-clip-text text-transparent animate-shimmer"
            style={{ backgroundSize: "200% 100%" }}
          >
            Donation.Box
          </span>{" "}
          in Action
        </motion.h2>

        <motion.p
          variants={textVariants}
          className="text-fg-muted text-base md:text-lg text-center mt-4 max-w-xl mx-auto"
        >
          Watch how easy it is to create and donate
        </motion.p>

        <motion.div
          variants={textVariants}
          className={`${glassCard} mt-10 overflow-hidden`}
        >
          <video
            ref={videoRef}
            src="/SCRIPT.mp4"
            controls
            playsInline
            className="w-full aspect-video object-cover rounded-3xl"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
