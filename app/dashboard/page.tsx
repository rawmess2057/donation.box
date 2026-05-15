"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import CreatorDashboard from "@/components/creator/CreatorDashboard";
import Link from "next/link";
import { Wallet, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const { publicKey } = useWallet();

  if (!publicKey) {
    return (
      <main className="min-h-screen bg-[#FFF9F0]">
        <div className="max-w-4xl mx-auto px-4 pt-28 pb-10 text-center">
          <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Wallet size={28} className="text-stone-400" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-stone-900 mb-3">
            Creator Dashboard
          </h1>
          <p className="text-lg text-stone-500 max-w-lg mx-auto mb-8">
            Connect your Solana wallet to manage your campaigns, track donations, and share impact updates.
          </p>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200 max-w-sm mx-auto">
            <div className="w-12 h-12 rounded-full bg-[#C25D2E]/10 flex items-center justify-center mx-auto mb-3">
              <Wallet size={22} className="text-[#C25D2E]" />
            </div>
            <p className="text-sm font-semibold text-stone-900 mb-1">Wallet Required</p>
            <p className="text-xs text-stone-500 mb-4">
              Use the wallet button in the navigation bar to connect.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#1E6E6B] hover:text-[#155552] transition-colors"
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
    <main className="min-h-screen bg-[#FFF9F0]">
      <CreatorDashboard creatorAddress={publicKey.toBase58()} />
    </main>
  );
}
