"use client";

import { motion, type Variants } from "framer-motion";
import { Wallet, Hexagon, ChevronRight, Monitor, ArrowUpRight } from "lucide-react";

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

const nodeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 120, damping: 12 },
  },
};

const glassNode =
  "bg-gradient-to-br from-primary/[0.08] via-transparent to-accent/[0.06] backdrop-blur-2xl border border-white/10 rounded-2xl";

export default function TechSection() {
  return (
    <section className="relative px-4 py-24 overflow-hidden">
      {/* Background shapes */}
      <motion.div
        className="absolute top-[10%] right-[5%] w-[180px] h-[180px] pointer-events-none z-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(127,191,127,0.1), rgba(3,225,255,0.03))",
          clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
        }}
        animate={{ x: [0, -15, 10, 0], y: [0, 10, -8, 0], rotate: [0, 5, -3, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[15%] left-[3%] w-[220px] h-[50px] pointer-events-none z-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(220,31,255,0.07), rgba(220,31,255,0.02))",
          clipPath: "polygon(0% 0%, 70% 0%, 100% 100%, 30% 100%)",
        }}
        animate={{ x: [0, 18, -8, 0], scale: [1, 1.06, 0.96, 1] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-b from-transparent to-bg pointer-events-none z-[1]" />

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center z-[2]">
        {/* Left: Text */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="order-2 lg:order-1"
        >
          <motion.span
            variants={textVariants}
            className="inline-block mb-4 rounded-full bg-primary-soft px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary"
          >
            The Technology
          </motion.span>

          <motion.h2
            variants={textVariants}
            className="text-4xl md:text-5xl font-bold leading-tight font-[family-name:var(--font-heading)]"
          >
            Built on{" "}
            <span
              className="bg-gradient-to-r from-primary via-accent to-success bg-clip-text text-transparent animate-shimmer"
              style={{ backgroundSize: "200% 100%" }}
            >
              Solana
            </span>
            .
            <br />
            Built for{" "}
            <span
              className="bg-gradient-to-r from-accent via-success to-primary bg-clip-text text-transparent animate-shimmer"
              style={{ backgroundSize: "200% 100%" }}
            >
              Trust
            </span>
            .
          </motion.h2>

          <motion.p
            variants={textVariants}
            className="text-fg-muted text-base md:text-lg leading-relaxed mt-6 max-w-lg"
          >
            We&apos;re just the interface. Your funds go straight from your wallet to
            the creator&apos;s wallet via smart contracts. No custody, no hidden fees.
            Just a transparent, immutable record on the blockchain.
          </motion.p>
        </motion.div>

        {/* Right: Flow diagram */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="order-1 lg:order-2"
        >
          <div className={`${glassNode} p-6 md:p-10`}>
            {/* Desktop: horizontal flow */}
            <div className="hidden md:flex items-center justify-center gap-4 lg:gap-6">
              <motion.div
                variants={nodeVariants}
                className={`${glassNode} p-4 md:p-6 flex flex-col items-center gap-3 min-w-[120px]`}
              >
                <Wallet className="w-8 h-8 text-primary" />
                <span className="text-sm font-semibold text-fg text-center">
                  Donor
                  <br />
                  Wallet
                </span>
              </motion.div>

              <motion.div
                variants={nodeVariants}
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <ChevronRight className="w-6 h-6 text-accent/40" />
              </motion.div>

              <motion.div
                variants={nodeVariants}
                className={`${glassNode} p-4 md:p-6 flex flex-col items-center gap-3 min-w-[120px] border-accent/20`}
                style={{ boxShadow: "0 0 30px rgba(3,225,255,0.08)" }}
              >
                <Hexagon className="w-8 h-8 text-accent" />
                <span className="text-sm font-semibold text-fg text-center">
                  Solana
                  <br />
                  Network
                </span>
              </motion.div>

              <motion.div
                variants={nodeVariants}
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              >
                <ChevronRight className="w-6 h-6 text-accent/40" />
              </motion.div>

              <motion.div
                variants={nodeVariants}
                className={`${glassNode} p-4 md:p-6 flex flex-col items-center gap-3 min-w-[120px]`}
              >
                <Wallet className="w-8 h-8 text-success" />
                <span className="text-sm font-semibold text-fg text-center">
                  Creator
                  <br />
                  Wallet
                </span>
              </motion.div>
            </div>

            {/* Mobile: vertical flow */}
            <div className="flex md:hidden flex-col items-center gap-4">
              <motion.div
                variants={nodeVariants}
                className={`${glassNode} p-4 flex items-center gap-4 w-full max-w-[220px]`}
              >
                <Wallet className="w-7 h-7 text-primary shrink-0" />
                <span className="text-sm font-semibold text-fg">Donor Wallet</span>
              </motion.div>

              <motion.div
                variants={nodeVariants}
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <ChevronRight className="w-5 h-5 text-accent/40 rotate-90" />
              </motion.div>

              <motion.div
                variants={nodeVariants}
                className={`${glassNode} p-4 flex items-center gap-4 w-full max-w-[220px] border-accent/20`}
                style={{ boxShadow: "0 0 30px rgba(3,225,255,0.08)" }}
              >
                <Hexagon className="w-7 h-7 text-accent shrink-0" />
                <span className="text-sm font-semibold text-fg">Solana Network</span>
              </motion.div>

              <motion.div
                variants={nodeVariants}
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              >
                <ChevronRight className="w-5 h-5 text-accent/40 rotate-90" />
              </motion.div>

              <motion.div
                variants={nodeVariants}
                className={`${glassNode} p-4 flex items-center gap-4 w-full max-w-[220px]`}
              >
                <Wallet className="w-7 h-7 text-success shrink-0" />
                <span className="text-sm font-semibold text-fg">Creator Wallet</span>
              </motion.div>
            </div>

            {/* Platform note */}
            <motion.div
              variants={textVariants}
              className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center gap-2 text-fg-subtle/60 text-xs md:text-sm"
            >
              <Monitor className="w-4 h-4" />
              <span>Platform (UI only) — never touches your funds</span>
              <ArrowUpRight className="w-3 h-3 text-accent/40" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
