"use client";

import { Search, Compass, Flame, PlusCircle, BarChart3, Wallet, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletReadyState } from "@solana/wallet-adapter-base";
import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Explore", icon: Compass, href: "/explore" },
  { label: "Impact", icon: Flame, href: "/impact" },
  { label: "Create", icon: PlusCircle, href: "/create" },
  { label: "Dashboard", icon: BarChart3, href: "/dashboard" },
];

const leftItems = navItems.slice(0, 2);
const rightItems = navItems.slice(2);

export default function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { disconnect, select, wallets, publicKey, connecting } = useWallet();
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      router.push(`/explore?q=${encodeURIComponent(q)}`);
    } else {
      router.push("/explore");
    }
  }, [searchQuery, router]);

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
        (w) =>
          w.adapter.name.toLowerCase().includes("phantom") &&
          readyStates.has(w.readyState),
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

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <nav className="relative grid grid-cols-3 items-center px-4 md:px-6 h-16 backdrop-blur-xl saturate-[1.5] border-b bg-white/5 border-white/10">
        {/* Left: Search + Desktop nav items */}
        <div className="flex items-center gap-1.5 justify-self-start">
          <form onSubmit={handleSearch} className="hidden md:flex items-center gap-1.5">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search campaigns..."
              className="w-40 lg:w-52 rounded-xl bg-white/[0.04] border border-white/10 px-3 py-1.5 text-xs text-fg placeholder:text-fg-subtle/60 outline-none transition-all duration-200 focus:border-primary/40 focus:bg-white/[0.06]"
            />
          </form>
          {leftItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`hidden md:flex items-center gap-1.5 rounded-xl px-3 py-2 text-[11px] font-semibold uppercase tracking-wide transition-all duration-200 ${
                isActive(item.href)
                  ? "bg-primary-soft text-primary"
                  : "text-fg-muted hover:text-fg hover:bg-white/10"
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Center: Logo */}
        <Link
          href="/"
          className="flex items-center justify-center gap-2 font-bold text-fg font-[family-name:var(--font-heading)]"
        >
          <img src="/solanaLogo.svg" alt="" className="h-5 w-auto" />
          <span className="text-lg tracking-tight">Donation.Box</span>
        </Link>

        {/* Right: Desktop nav items + Wallet + Mobile hamburger */}
        <div className="flex items-center gap-1.5 justify-self-end">
          {rightItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`hidden md:flex items-center gap-1.5 rounded-xl px-3 py-2 text-[11px] font-semibold uppercase tracking-wide transition-all duration-200 ${
                isActive(item.href)
                  ? "bg-primary-soft text-primary"
                  : "text-fg-muted hover:text-fg hover:bg-white/10"
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          ))}

          <button
            onClick={handleWalletClick}
            disabled={connecting}
            className={`hidden md:flex items-center gap-1.5 rounded-xl px-3 py-2 text-[11px] font-semibold uppercase tracking-wide transition-all duration-200 ${
              publicKey
                ? "bg-accent-soft text-accent"
                : "bg-primary-soft text-primary hover:bg-primary hover:text-white"
            } disabled:opacity-50`}
          >
            <Wallet className="h-4 w-4" />
            {getWalletLabel()}
          </button>

          {/* Mobile: Search icon + Hamburger */}
          <form onSubmit={handleSearch} className="md:hidden">
            <button
              type="submit"
              className="flex items-center justify-center rounded-xl p-2 text-fg-muted hover:text-fg hover:bg-white/10 transition-all duration-200"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>
          </form>
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden flex items-center justify-center rounded-xl p-2 text-fg-muted hover:text-fg hover:bg-white/10 transition-all duration-200"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* Mobile hamburger drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-overlay backdrop-blur-sm md:hidden"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-bg-card border-l border-white/10 p-6 md:hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-sm font-bold text-fg">Menu</span>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl p-2 text-fg-muted hover:text-fg hover:bg-white/10 transition-all duration-200"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                      isActive(item.href)
                        ? "bg-primary-soft text-primary"
                        : "text-fg-muted hover:text-fg hover:bg-white/10"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                ))}
              </div>

              <hr className="my-4 border-white/10" />

              <button
                onClick={() => { handleWalletClick(); setMenuOpen(false); }}
                disabled={connecting}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 w-full ${
                  publicKey
                    ? "bg-accent-soft text-accent"
                    : "bg-primary-soft text-primary hover:bg-primary hover:text-white"
                } disabled:opacity-50`}
              >
                <Wallet className="h-5 w-5" />
                {getWalletLabel()}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
