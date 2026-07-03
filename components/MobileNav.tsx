"use client";

import { Compass, Home, PlusCircle, BarChart3, Wallet, Flame } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletReadyState } from "@solana/wallet-adapter-base";

const navItems = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Explore", icon: Compass, href: "/explore" },
  { label: "Create", icon: PlusCircle, href: "/create" },
  { label: "Impact", icon: Flame, href: "/impact" },
  { label: "Dashboard", icon: BarChart3, href: "/dashboard" },
];

export default function MobileNav() {
  const pathname = usePathname();
  const { disconnect, select, wallets, publicKey, connecting } = useWallet();

  const handleWalletClick = async () => {
    try {
      if (publicKey) {
        await disconnect();
        return;
      }

      const readyStates = new Set<WalletReadyState>([
        WalletReadyState.Installed,
        WalletReadyState.Loadable,
      ]);

      const phantom = wallets.find(
        (walletOption) =>
          walletOption.adapter.name.toLowerCase().includes("phantom") &&
          readyStates.has(walletOption.readyState),
      );

      const selectedWallet = phantom || wallets.find((w) => readyStates.has(w.readyState));

      if (!selectedWallet) {
        console.error("No wallet available. Install Phantom or Backpack.");
        return;
      }

      select(selectedWallet.adapter.name);
      await selectedWallet.adapter.connect();
    } catch (error) {
      console.error("Wallet connection error:", error);
    }
  };

  const getWalletLabel = () => {
    if (connecting) return "Connecting...";
    if (publicKey) return publicKey.toBase58().slice(0, 6);
    return "Connect";
  };

  return (
    <nav className="relative flex items-center justify-between px-4 h-16 backdrop-blur-xl saturate-[1.5] border-b bg-white/5 dark:bg-white/[0.03] border-white/10 dark:border-white/5">
      <Link href="/" className="flex items-center gap-2 font-bold text-fg font-[family-name:var(--font-heading)]">
        <span className="text-lg">◆</span>
        <span className="hidden sm:inline">Donation.Box</span>
      </Link>

      <div className="flex items-center gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-[11px] font-semibold uppercase tracking-wide transition-all duration-200 ${
                isActive
                  ? "bg-primary-soft text-primary"
                  : "text-fg-muted hover:text-fg hover:bg-bg-muted"
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{item.label}</span>
            </Link>
          );
        })}

        <button
          onClick={handleWalletClick}
          disabled={connecting}
          className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-[11px] font-semibold uppercase tracking-wide transition-all duration-200 ${
            publicKey
              ? "bg-accent-soft text-accent"
              : "bg-primary-soft text-primary hover:bg-primary hover:text-white"
          } disabled:opacity-50`}
        >
          <Wallet className="h-4 w-4" />
          {getWalletLabel()}
        </button>
      </div>
    </nav>
  );
}
