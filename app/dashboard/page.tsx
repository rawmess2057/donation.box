"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import CreatorDashboard from "@/components/creator/CreatorDashboard";
import Link from "next/link";

export default function DashboardPage() {
  const { publicKey } = useWallet();

  if (!publicKey) {
    return (
      <main className="min-h-screen bg-[#FFF9F0] px-4 pt-28 pb-10">
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="text-4xl font-bold text-[#97422F] mb-4">Creator Dashboard</h1>
          <p className="text-lg text-stone-600 mb-8">
            Please connect your wallet to view your campaign dashboard.
          </p>
          <Link
            href="/"
            className="inline-block bg-[#97422F] text-white font-bold py-3 px-8 rounded-full hover:bg-[#8B3F24] transition"
          >
            Return Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFF9F0] pt-28">
      <CreatorDashboard creatorAddress={publicKey.toBase58()} />
    </main>
  );
}
