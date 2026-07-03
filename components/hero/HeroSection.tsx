"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import ScrollArrow from "@/components/ui/ScrollArrow";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const badgeVariant: Variants = {
  hidden: { opacity: 0, y: -20, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 150, damping: 16 },
  },
};

const headingLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 100, damping: 14 },
  },
};

const headingRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 100, damping: 14 },
  },
};

const gradientReveal: Variants = {
  hidden: { opacity: 0, scale: 0.9, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 80, damping: 12, delay: 0.15 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 14 },
  },
};

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-10 overflow-hidden">
      {/* Four corner Solana parallelograms */}
      <motion.div
        className="absolute top-[10%] left-[3%] w-[100px] h-[40px]"
        style={{
          background: "linear-gradient(135deg, rgba(127,191,127,0.15), rgba(127,191,127,0.05))",
          clipPath: "polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)",
        }}
        animate={{ x: [0, 15, 0], y: [0, -10, 0], rotate: [0, 3, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[15%] right-[3%] w-[180px] h-[70px]"
        style={{
          background: "linear-gradient(135deg, rgba(3,225,255,0.1), rgba(220,31,255,0.04))",
          clipPath: "polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)",
        }}
        animate={{ x: [0, -20, 0], y: [0, 15, 0], rotate: [0, -2.5, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="absolute bottom-[12%] left-[3%] w-[220px] h-[85px]"
        style={{
          background: "linear-gradient(135deg, rgba(220,31,255,0.1), rgba(220,31,255,0.03))",
          clipPath: "polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)",
        }}
        animate={{ x: [0, 25, 0], y: [0, -18, 0], rotate: [0, 4, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
      <motion.div
        className="absolute bottom-[18%] right-[2%] w-[260px] h-[100px]"
        style={{
          background: "linear-gradient(135deg, rgba(127,191,127,0.08), rgba(3,225,255,0.03))",
          clipPath: "polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)",
        }}
        animate={{ x: [0, -30, 0], y: [0, 20, 0], rotate: [0, -3.5, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <motion.div
        className="relative max-w-4xl mx-auto px-6 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.span
          variants={badgeVariant}
          className="inline-block mb-6 rounded-full bg-primary-soft px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary"
        >
          Decentralized Crowdfunding on Solana
        </motion.span>

        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.1] tracking-tight text-fg font-[family-name:var(--font-heading)]">
          <motion.span variants={headingLeft} className="block">Rebuilding Hope,</motion.span>
          <motion.span
            variants={gradientReveal}
            className="block bg-gradient-to-r from-primary via-accent to-success bg-clip-text text-transparent"
            style={{ backgroundSize: "200% 100%" }}
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            One Community
          </motion.span>
          <motion.span variants={headingRight} className="block">at a Time</motion.span>
        </h1>

        <motion.p
          variants={fadeUp}
          className="mt-6 text-lg md:text-xl text-fg-muted max-w-2xl mx-auto leading-relaxed"
        >
          Join our mission to empower rural Nepali communities through
          sustainable crowdfunding and transparent fundraising on Solana.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-8 flex flex-wrap justify-center gap-4">
          <motion.div
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="group"
          >
            <Link
              href="/explore"
              className="block bg-white/[0.04] backdrop-blur-2xl border border-white/20 text-white font-semibold text-lg px-10 py-4 rounded-2xl shadow-[0_0_15px_rgba(127,191,127,0.15)] hover:shadow-[0_0_40px_rgba(127,191,127,0.3)] hover:border-primary/50 hover:bg-primary/15 transition-all duration-500 ease-out"
            >
              Start Exploring
              <span className="ml-2 inline-block transition-transform duration-500 ease-out group-hover:translate-x-2">&rarr;</span>
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="group"
          >
            <Link
              href="/create"
              className="block bg-white/[0.04] backdrop-blur-2xl border border-white/20 text-accent font-semibold text-lg px-10 py-4 rounded-2xl shadow-[0_0_15px_rgba(3,225,255,0.1)] hover:shadow-[0_0_40px_rgba(3,225,255,0.25)] hover:border-accent/50 hover:text-white hover:bg-accent/15 transition-all duration-500 ease-out"
            >
              Start a Campaign
              <span className="ml-2 inline-block transition-transform duration-500 ease-out group-hover:translate-x-2">&rarr;</span>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-16 flex justify-center">
          <ScrollArrow />
        </motion.div>
      </motion.div>
    </section>
  );
}
