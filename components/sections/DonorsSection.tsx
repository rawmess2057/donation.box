"use client";

import { motion, type Variants } from "framer-motion";
import { Eye, Pointer, CheckCircle, ArrowRight, ArrowDown } from "lucide-react";

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

const stepVariants: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 120, damping: 12 },
  },
};

const glassNode =
  "bg-gradient-to-br from-primary/[0.08] via-transparent to-accent/[0.06] backdrop-blur-2xl border border-white/10 rounded-2xl";

const steps = [
  {
    icon: Eye,
    label: "See a Blink",
    desc: "On X, Discord, or any website",
  },
  {
    icon: Pointer,
    label: "Click Confirm",
    desc: "Connect wallet & approve",
  },
  {
    icon: CheckCircle,
    label: "Donation Sent",
    desc: "Direct to creator — instantly",
  },
];

export default function DonorsSection() {
  return (
    <section className="relative px-4 py-24 overflow-hidden">
      {/* Background shapes */}
      <motion.div
        className="absolute top-[5%] right-[3%] w-[200px] h-[80px] pointer-events-none z-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(127,191,127,0.08), rgba(3,225,255,0.03))",
          clipPath: "polygon(0% 0%, 70% 0%, 100% 100%, 30% 100%)",
        }}
        animate={{ x: [0, 15, -8, 0], scale: [1, 1.05, 0.97, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
      <motion.div
        className="absolute bottom-[10%] left-[1%] w-[140px] h-[140px] pointer-events-none z-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(220,31,255,0.06), rgba(220,31,255,0.02))",
          clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
        }}
        animate={{ x: [0, -10, 8, 0], y: [0, 12, -6, 0], rotate: [0, 5, -3, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center z-[2]">
        {/* Left: 3-step visual */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex justify-center"
        >
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            {steps.map((step, i) => (
              <div key={step.label} className="flex items-center gap-4 md:gap-6">
                <motion.div
                  variants={stepVariants}
                  className={`${glassNode} p-5 md:p-6 flex flex-col items-center gap-3 min-w-[130px]`}
                >
                  <div className="w-12 h-12 rounded-full bg-white/[0.06] backdrop-blur-xl border border-white/10 flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-accent" />
                  </div>
                  <div className="text-center">
                    <span className="block text-sm font-semibold text-fg">
                      {step.label}
                    </span>
                    <span className="block text-[11px] text-fg-subtle mt-1">
                      {step.desc}
                    </span>
                  </div>
                </motion.div>

                {i < steps.length - 1 && (
                  <motion.div
                    variants={stepVariants}
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                    className="hidden md:block"
                  >
                    <ArrowRight className="w-5 h-5 text-accent/40" />
                  </motion.div>
                )}

                {i < steps.length - 1 && (
                  <motion.div
                    variants={stepVariants}
                    animate={{ y: [0, 4, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                    className="md:hidden"
                  >
                    <ArrowDown className="w-5 h-5 text-accent/40" />
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right: Text */}
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
            For Donors
          </motion.span>

          <motion.h2
            variants={textVariants}
            className="text-4xl md:text-5xl font-bold leading-tight font-[family-name:var(--font-heading)]"
          >
            Donate with{" "}
            <span
              className="bg-gradient-to-r from-primary via-accent to-success bg-clip-text text-transparent animate-shimmer"
              style={{ backgroundSize: "200% 100%" }}
            >
              Zero Friction
            </span>
            .
          </motion.h2>

          <motion.p
            variants={textVariants}
            className="text-fg-muted text-base md:text-lg leading-relaxed mt-6 max-w-lg"
          >
            Support your favorite creators and causes right where you already are.
            Connect your wallet, click confirm, and you&apos;re done. Your
            donation goes directly to them. Period.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
