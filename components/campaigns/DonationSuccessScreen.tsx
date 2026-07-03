"use client";

import { useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Share2, Home, X } from "lucide-react";
import { getExplorerTxUrl } from "@/lib/explorer";
import AnimatedNumber from "@/components/ui/AnimatedNumber";

type DonationSuccessScreenProps = {
  donorName?: string;
  amountInSOL: number;
  currency: "SOL";
  txSignature: string;
  impactMessage: string;
  onDonateAgain?: () => void;
  onClose?: () => void;
  open: boolean;
};

export default function DonationSuccessScreen({
  donorName = "Friend",
  amountInSOL,
  currency,
  txSignature,
  impactMessage,
  onDonateAgain,
  onClose,
  open,
}: DonationSuccessScreenProps) {
  const hasFired = useRef(false);

  useEffect(() => {
    if (!open || hasFired.current) return;
    hasFired.current = true;

    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        startVelocity: 30,
        spread: 120,
        origin: { x: Math.random(), y: Math.random() * 0.5 },
        colors: ["#D97706", "#0D9488", "#059669", "#F59E0B"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    void confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.6 },
      colors: ["#D97706", "#0D9488", "#059669", "#F59E0B"],
    });

    setTimeout(() => requestAnimationFrame(frame), 500);
  }, [open]);

  const handleShare = () => {
    const shareText = `I just donated ${amountInSOL.toFixed(4)} SOL to help: ${impactMessage}. Join me in making an impact!`;

    if (navigator.share) {
      navigator.share({
        title: "Donation.Box",
        text: shareText,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(shareText);
    }
  };

  const badgeNumber = useMemo(() => {
    return txSignature
      .slice(0, 6)
      .split("")
      .reduce((total, char) => total + char.charCodeAt(0), 0);
  }, [txSignature]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center glass-overlay p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="glass-card max-w-4xl w-full rounded-3xl overflow-hidden shadow-2xl relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors"
              aria-label="Close"
            >
              <X size={20} className="text-fg-muted" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
              <div className="md:col-span-7 p-8 md:p-10 flex flex-col">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="space-y-2 mb-6"
                >
                  <h1 className="text-4xl md:text-5xl font-bold text-primary leading-tight font-[family-name:var(--font-heading)]">
                    Heartfelt Thanks, {donorName}!
                  </h1>
                  <p className="text-lg font-medium text-fg-muted">
                    Your kindness radiates warmth across borders.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.5 }}
                  className="glass rounded-3xl p-6 relative overflow-hidden mb-6"
                >
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="font-bold text-lg text-success">Impact Confirmed</span>
                    </div>

                    <p className="text-xl text-fg leading-relaxed">
                      {impactMessage}
                    </p>

                    <div className="flex items-center gap-3 bg-bg-card rounded-2xl p-4">
                      <span className="text-3xl font-bold text-primary tabular-nums">
                        <AnimatedNumber to={amountInSOL} suffix={` ${currency}`} decimals={4} />
                      </span>
                    </div>

                    <div className="pt-4 mt-4 border-t border-border space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-semibold text-fg-muted">Transaction</span>
                        <a
                          href={getExplorerTxUrl(txSignature)}
                          target="_blank"
                          rel="noreferrer"
                          className="text-accent font-bold hover:underline text-xs"
                        >
                          Solana Explorer ↗
                        </a>
                      </div>
                      <div className="flex justify-between items-center bg-bg-card rounded-xl p-3 border border-border">
                        <span className="font-bold text-fg text-sm">
                          {amountInSOL.toFixed(4)} {currency}
                        </span>
                        <span className="text-xs text-fg-subtle font-mono">
                          {txSignature.slice(0, 4)}...{txSignature.slice(-4)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="flex flex-col sm:flex-row gap-3 mt-auto"
                >
                  <button
                    onClick={handleShare}
                    className="flex-1 bg-primary hover:bg-primary-hover text-white font-bold py-4 px-6 rounded-full shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Share2 size={18} />
                    Share
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 bg-bg-muted text-fg font-bold py-4 px-6 rounded-full hover:bg-border transition-all active:scale-95 flex items-center justify-center gap-2 border border-border"
                  >
                    <Home size={18} />
                    Close
                  </button>
                  {onDonateAgain && (
                    <button
                      onClick={onDonateAgain}
                      className="flex-1 bg-success text-white font-bold py-4 px-6 rounded-full hover:brightness-110 transition-all active:scale-95"
                    >
                      Donate Again
                    </button>
                  )}
                </motion.div>
              </div>

              <div className="md:col-span-5 glass p-6 flex items-center justify-center relative border-l border-white/10 dark:border-white/5">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full"
                >
                  <div className="absolute top-6 right-6 z-10">
                    <div className="w-10 h-10 rounded-full bg-success-soft flex items-center justify-center text-success">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-4">
                    <div className="space-y-3">
                      <span className="inline-block px-3 py-1 rounded-full bg-primary-soft text-primary text-xs font-bold uppercase tracking-widest">
                        Digital cNFT Reward
                      </span>
                      <h3 className="text-2xl font-bold text-fg font-[family-name:var(--font-heading)]">
                        The Hearth Keeper
                      </h3>
                      <p className="text-sm text-fg-muted font-medium leading-relaxed">
                        Limited Edition Impact Badge #{badgeNumber}. Unique digital collectible minted on Solana.
                      </p>
                    </div>

                    <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-primary/30 to-accent/30">
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-5xl mb-2">🔥</div>
                          <div className="text-xs font-bold text-fg-muted">Impact Proof</div>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end text-xs">
                        <div className="text-white">
                          <p className="uppercase font-bold tracking-tighter opacity-80 text-[9px]">Owner</p>
                          <p className="font-bold">{donorName}</p>
                        </div>
                        <div className="text-white text-right">
                          <p className="uppercase font-bold tracking-tighter opacity-80 text-[9px]">Date</p>
                          <p className="font-bold">{new Date().toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-bold text-fg-subtle pt-2 border-t border-border">
                      <span>💎</span>
                      <span className="truncate">
                        MINT_ID: e627...{txSignature.slice(-4).toUpperCase()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
