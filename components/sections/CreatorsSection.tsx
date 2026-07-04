"use client";

import { motion, type Variants } from "framer-motion";
import { LayoutDashboard, MessageSquareMore, BarChart3, Users, ArrowRight } from "lucide-react";

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
  "bg-gradient-to-br from-primary/[0.08] via-transparent to-accent/[0.06] backdrop-blur-2xl border border-white/10 rounded-2xl";

export default function CreatorsSection() {
  return (
    <section className="relative px-4 py-24 overflow-hidden">
      {/* Background shapes */}
      <motion.div
        className="absolute top-[15%] left-[2%] w-[120px] h-[120px] pointer-events-none z-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(127,191,127,0.1), rgba(127,191,127,0.03))",
          clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
        }}
        animate={{ x: [0, 10, -6, 0], y: [0, -12, 8, 0], rotate: [0, 6, -3, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[20%] right-[2%] w-[160px] h-[130px] pointer-events-none z-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(3,225,255,0.07), rgba(3,225,255,0.02))",
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
        }}
        animate={{ x: [0, -12, 6, 0], y: [0, 8, -10, 0], rotate: [0, -4, 2, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center z-[2]">
        {/* Left: Text */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.span
            variants={textVariants}
            className="inline-block mb-4 rounded-full bg-primary-soft px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary"
          >
            For Creators &amp; Causes
          </motion.span>

          <motion.h2
            variants={textVariants}
            className="text-4xl md:text-5xl font-bold leading-tight font-[family-name:var(--font-heading)]"
          >
            Get Funded in{" "}
            <span
              className="bg-gradient-to-r from-primary via-accent to-success bg-clip-text text-transparent animate-shimmer"
              style={{ backgroundSize: "200% 100%" }}
            >
              Seconds
            </span>
            .
          </motion.h2>

          <motion.p
            variants={textVariants}
            className="text-fg-muted text-base md:text-lg leading-relaxed mt-6 max-w-lg"
          >
            Stop asking for wallet addresses. With a Donation Blink, your
            supporters can donate directly from X, Discord, or your website. No
            forms, no percentage fees, no delays.
          </motion.p>

          <motion.a
            variants={textVariants}
            href="/create"
            className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-accent hover:text-accent-hover transition-colors duration-300"
          >
            Learn more about Blinks
            <ArrowRight className="w-4 h-4" />
          </motion.a>
        </motion.div>

        {/* Right: Split-screen visual */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 gap-3"
        >
          {/* Dashboard card */}
          <motion.div
            variants={textVariants}
            className={`${glassCard} p-4 md:p-5 space-y-3`}
          >
            <div className="flex items-center gap-2 text-fg-muted">
              <LayoutDashboard className="w-4 h-4" />
              <span className="text-[11px] font-semibold uppercase tracking-wider">
                Dashboard
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-fg-muted">
                <BarChart3 className="w-3 h-3" />
                <span>24.8 SOL raised</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-fg-muted">
                <Users className="w-3 h-3" />
                <span>147 donors</span>
              </div>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-success"
                initial={{ width: 0 }}
                whileInView={{ width: "68%" }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <div className="w-3/4 h-1.5 rounded-full bg-white/10" />
            <div className="w-1/2 h-1.5 rounded-full bg-white/10" />
          </motion.div>

          {/* Social feed card */}
          <motion.div
            variants={textVariants}
            className={`${glassCard} p-4 md:p-5 space-y-3`}
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30" />
              <div className="flex-1">
                <div className="w-16 h-2 rounded-full bg-white/10" />
                <div className="w-10 h-1.5 rounded-full bg-white/10 mt-1" />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="w-full h-2 rounded-full bg-white/10" />
              <div className="w-5/6 h-2 rounded-full bg-white/10" />
              <div className="w-4/6 h-2 rounded-full bg-white/10" />
            </div>
            <div className="flex items-center gap-2">
              <MessageSquareMore className="w-3 h-3 text-primary/40" />
              <span className="text-[10px] text-primary/40">Support my campaign!</span>
            </div>
            <div className="w-full h-8 rounded-lg bg-white/[0.04] backdrop-blur-xl border border-white/10 flex items-center justify-center">
                <span className="text-[10px] font-semibold text-primary tracking-wider">
                  Donate
              </span>
            </div>
            <span className="block text-[9px] text-fg-subtle/50 text-center">
              via Donation.Box
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
