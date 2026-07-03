"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { motion, type Variants } from "framer-motion";
import CreatorDashboard from "@/components/creator/CreatorDashboard";
import Link from "next/link";
import { Wallet, ArrowRight } from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 100, damping: 14 },
  },
};

export default function DashboardPage() {
  const { publicKey } = useWallet();

  if (!publicKey) {
    return (
      <main className="min-h-screen bg-bg relative overflow-hidden">
        {/* Background shapes */}
        <motion.div
          className="absolute top-[10%] right-[2%] w-[180px] h-[70px] pointer-events-none z-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(127,191,127,0.1), rgba(127,191,127,0.03))",
            clipPath: "polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)",
          }}
          animate={{ x: [0, -15, 10, 0], y: [0, 8, -6, 0], rotate: [0, 3, -2, 0] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[20%] left-[1%] w-[160px] h-[160px] pointer-events-none z-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(3,225,255,0.07), rgba(3,225,255,0.02))",
            clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
          }}
          animate={{ x: [0, 12, -8, 0], y: [0, -10, 6, 0], rotate: [0, 5, -3, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
        <motion.div
          className="absolute top-[40%] left-[5%] w-[140px] h-[120px] pointer-events-none z-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(220,31,255,0.06), rgba(220,31,255,0.02))",
            clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
          }}
          animate={{ x: [0, -8, 12, 0], y: [0, 8, -4, 0], rotate: [0, -3, 2, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        <div className="relative max-w-4xl mx-auto px-4 pt-10 pb-10 text-center z-[2]">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={itemVariants}
              className="w-16 h-16 glass-surface rounded-2xl flex items-center justify-center mx-auto mb-6"
            >
              <Wallet size={28} className="text-fg-subtle" />
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold text-fg mb-3 font-[family-name:var(--font-heading)]"
            >
              Creator Dashboard
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-lg text-fg-muted max-w-lg mx-auto mb-8"
            >
              Connect your Solana wallet to manage your campaigns, track donations, and share impact updates.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-primary/[0.04] via-transparent to-accent/[0.02] backdrop-blur-2xl border border-white/10 rounded-2xl p-8 max-w-sm mx-auto"
            >
              <div className="w-12 h-12 rounded-full bg-primary-soft flex items-center justify-center mx-auto mb-3">
                <Wallet size={22} className="text-primary" />
              </div>
              <p className="text-sm font-semibold text-fg mb-1">Wallet Required</p>
              <p className="text-xs text-fg-muted mb-4">
                Use the wallet button in the navigation bar to connect.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-hover transition-colors"
              >
                Return Home
                <ArrowRight size={14} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg relative overflow-hidden">
      {/* Background shapes */}
      <motion.div
        className="absolute top-[5%] right-[1%] w-[180px] h-[70px] pointer-events-none z-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(127,191,127,0.1), rgba(127,191,127,0.03))",
          clipPath: "polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)",
        }}
        animate={{ x: [0, -15, 10, 0], rotate: [0, 3, -2, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[10%] left-[1%] w-[160px] h-[160px] pointer-events-none z-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(3,225,255,0.07), rgba(220,31,255,0.03))",
          clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
        }}
        animate={{ x: [0, 12, -8, 0], y: [0, -10, 6, 0], rotate: [0, 5, -3, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />

      <div className="relative z-[2]">
        <CreatorDashboard creatorAddress={publicKey.toBase58()} />
      </div>
    </main>
  );
}
