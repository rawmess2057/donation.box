"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import CreatorDashboard from "@/components/creator/CreatorDashboard";
import Link from "next/link";
import { Wallet, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const { publicKey } = useWallet();

  if (!publicKey) {
    return (
      <main className="min-h-screen bg-bg">
        <div className="max-w-4xl mx-auto px-4 pt-10 pb-10 text-center">
          <div className="w-16 h-16 glass-surface rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Wallet size={28} className="text-fg-subtle" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-fg mb-3 font-[family-name:var(--font-heading)]">
            Creator Dashboard
          </h1>
          <p className="text-lg text-fg-muted max-w-lg mx-auto mb-8">
            Connect your Solana wallet to manage your campaigns, track donations, and share impact updates.
          </p>

          <div className="glass-surface rounded-2xl p-8 max-w-sm mx-auto">
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
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg">
      <CreatorDashboard creatorAddress={publicKey.toBase58()} />
    </main>
  );
}
