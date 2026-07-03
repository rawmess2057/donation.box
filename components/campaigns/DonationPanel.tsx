"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Info, Share2 } from "lucide-react";
import ProgressBar from "@/components/ui/ProgressBar";

type DonationPanelProps = {
  raised: number;
  goal: number;
  currency?: "SOL";
  minDonation?: number;
  maxDonation?: number;
  isProcessing?: boolean;
  onDonate?: (amount: number, currency: "SOL") => void;
};

const PRESET_AMOUNTS = [
  { value: 0.1, label: "0.1 SOL", impact: "≈ 2 meals" },
  { value: 0.5, label: "0.5 SOL", impact: "≈ 10 meals" },
  { value: 1, label: "1 SOL", impact: "≈ 20 meals" },
  { value: 2, label: "2 SOL", impact: "≈ 40 meals" },
];

const SOL_TO_USD = 145;

function formatMoney(value: number) {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

export default function DonationPanel({
  raised,
  goal,
  currency = "SOL",
  minDonation = 0.01,
  maxDonation = 10,
  isProcessing = false,
  onDonate,
}: DonationPanelProps) {
  const [selectedAmount, setSelectedAmount] = useState<number>(0.5);
  const [customAmount, setCustomAmount] = useState<string>("");

  const progress = useMemo(() => {
    if (goal <= 0) return 0;
    return Math.min(100, Math.round((raised / goal) * 100));
  }, [raised, goal]);

  const amountFromCustom = customAmount.trim() ? Number(customAmount) : null;
  const finalAmount = amountFromCustom ?? selectedAmount;

  const amountError = useMemo(() => {
    if (!Number.isFinite(finalAmount)) return "Enter a valid amount.";
    if (finalAmount < minDonation) return `Minimum donation is ${minDonation} SOL.`;
    if (finalAmount > maxDonation) return `Maximum donation is ${maxDonation.toLocaleString()} SOL.`;
    return "";
  }, [finalAmount, minDonation, maxDonation]);

  const isValidAmount = amountError === "";
  const remaining = Math.max(0, goal - raised);
  const usdValue = finalAmount * SOL_TO_USD;

  const handleCustomAmountChange = (raw: string) => {
    const cleaned = raw.replace(/[^\d.]/g, "");
    const parts = cleaned.split(".");
    const normalized = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join("")}` : cleaned;
    setCustomAmount(normalized);
  };

  const handleDonate = () => {
    if (!isValidAmount) return;
    if (onDonate) {
      onDonate(finalAmount, currency);
    }
  };

  return (
    <aside className="rounded-2xl glass-surface p-5 liquid-glass">
      <ProgressBar
        value={raised}
        max={goal}
        showPercentage
        className="mb-5"
      />

      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-fg-muted">
        Choose amount
      </p>

      <div className="mb-3 grid grid-cols-2 gap-2">
        {PRESET_AMOUNTS.map(({ value, label, impact }) => {
          const active = !customAmount && selectedAmount === value;
          return (
            <motion.button
              key={value}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedAmount(value);
                setCustomAmount("");
              }}
              className={`
                rounded-xl px-3 py-3 text-left transition-all duration-200
                ${active
                  ? "bg-primary/20 backdrop-blur-xl border border-primary/40 text-primary shadow-[0_0_10px_rgba(127,191,127,0.15)]"
                  : "bg-white/[0.04] backdrop-blur-xl border border-white/10 text-fg hover:border-primary/50"
                }
              `}
            >
              <span className="text-sm font-bold block">{label}</span>
              <span className={`text-[10px] ${active ? "text-primary/70" : "text-fg-subtle"}`}>
                {impact}
              </span>
            </motion.button>
          );
        })}
      </div>

      <label className="mb-1 block text-xs uppercase tracking-wide text-fg-subtle">
        Custom amount ({currency})
      </label>
      <div className="relative mb-2">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-fg-muted font-semibold">
          ◎
        </span>
        <input
          type="text"
          inputMode="decimal"
          value={customAmount}
          onChange={(e) => handleCustomAmountChange(e.target.value)}
          placeholder="0.00"
          className="w-full rounded-xl border border-white/15 bg-white/[0.04] backdrop-blur-xl pl-8 pr-3 py-2.5 text-sm outline-none transition-all duration-300 focus:border-primary/50 focus:shadow-[0_0_12px_rgba(127,191,127,0.1)] text-fg placeholder:text-fg-subtle"
        />
      </div>

      {isValidAmount && finalAmount > 0 && (
        <p className="mb-2 text-xs text-fg-subtle">
          ≈ ${formatMoney(usdValue)} USD ·{" "}
          <span className="text-fg-muted font-medium">
            {customAmount ? `Donating ${formatMoney(finalAmount)} SOL` : ""}
          </span>
        </p>
      )}

      {amountError ? (
        <p className="mb-3 text-xs text-red-500">{amountError}</p>
      ) : null}

      <motion.button
        type="button"
        disabled={!isValidAmount || isProcessing}
        whileHover={isValidAmount && !isProcessing ? { scale: 1.01 } : {}}
        whileTap={isValidAmount && !isProcessing ? { scale: 0.99 } : {}}
        className="w-full rounded-xl bg-white/[0.04] backdrop-blur-2xl border border-white/20 text-white font-bold py-3.5 transition-all duration-500 ease-out disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(3,225,255,0.1)] hover:shadow-[0_0_40px_rgba(3,225,255,0.25)] hover:border-accent/50 hover:bg-accent/15"
        onClick={handleDonate}
      >
        {isProcessing ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Processing...
          </span>
        ) : (
          `Donate ${isValidAmount ? `${formatMoney(finalAmount)} SOL` : ""}`
        )}
      </motion.button>

      <div className="mt-4 flex items-center justify-between rounded-xl glass-surface px-3 py-2">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-content-center rounded-full bg-accent text-white text-xs font-bold">
            S
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-fg-muted">
              Powered by Solana
            </p>
            <p className="text-xs text-fg-subtle">Instant & Transparent</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-fg-muted">
          <button type="button" className="rounded-md p-1.5 hover:bg-white/10 transition-colors" aria-label="Share campaign">
            <Share2 className="h-4 w-4" />
          </button>
          <button type="button" className="rounded-md p-1.5 hover:bg-white/10 transition-colors" aria-label="Donation info">
            <Info className="h-4 w-4" />
          </button>
        </div>
      </div>

      <p className="mt-3 text-[11px] text-center text-fg-subtle">
        {progress}% funded · {formatMoney(remaining)} SOL remaining
      </p>
    </aside>
  );
}
