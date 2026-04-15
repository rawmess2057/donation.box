"use client";

import { useMemo, useState } from "react";
import { Info, Share2 } from "lucide-react";

type DonationPanelProps = {
  raised: number;
  goal: number;
  currency?: "USDC" | "USD";
  minDonation?: number;
  maxDonation?: number;
  onDonate?: (amount: number, currency: "USDC" | "USD") => void;
};

const PRESET_AMOUNTS = [5, 10, 25, 50];

function formatMoney(value: number) {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

export default function DonationPanel({
  raised,
  goal,
  currency = "USDC",
  minDonation = 1,
  maxDonation = 25000,
  onDonate,
}: DonationPanelProps) {
  const [selectedAmount, setSelectedAmount] = useState<number>(10);
  const [customAmount, setCustomAmount] = useState<string>("");

  const progress = useMemo(() => {
    if (goal <= 0) return 0;
    return Math.min(100, Math.round((raised / goal) * 100));
  }, [raised, goal]);

  const amountFromCustom = customAmount.trim() ? Number(customAmount) : null;
  const finalAmount = amountFromCustom ?? selectedAmount;

  const amountError = useMemo(() => {
    if (!Number.isFinite(finalAmount)) return "Enter a valid amount.";
    if (finalAmount < minDonation) return `Minimum donation is $${minDonation}.`;
    if (finalAmount > maxDonation) return `Maximum donation is $${maxDonation.toLocaleString()}.`;
    return "";
  }, [finalAmount, minDonation, maxDonation]);

  const isValidAmount = amountError === "";
  const remaining = Math.max(0, goal - raised);

  const handleCustomAmountChange = (raw: string) => {
    // Allow only digits and one decimal point.
    const cleaned = raw.replace(/[^\d.]/g, "");
    const parts = cleaned.split(".");
    const normalized =
      parts.length > 2 ? `${parts[0]}.${parts.slice(1).join("")}` : cleaned;

    setCustomAmount(normalized);
  };

  const handleDonate = () => {
    if (!isValidAmount) return;
    if (onDonate) {
      onDonate(finalAmount, currency);
      return;
    }
    // Fallback while wallet flow is not connected.
    window.alert(`Proceeding to donate $${formatMoney(finalAmount)} ${currency}`);
  };

  return (
    <aside className="rounded-2xl bg-[#F2EEE7] p-5 shadow-sm">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-stone-500">Raised</p>
          <p className="text-2xl font-bold text-[#9A432E]">
            ${formatMoney(raised)} <span className="text-sm">{currency}</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wide text-stone-500">Goal</p>
          <p className="text-xl font-semibold text-stone-900">${formatMoney(goal)}</p>
        </div>
      </div>

      <div className="mb-2 h-2 w-full rounded bg-stone-300">
        <div className="h-2 rounded bg-[#2D7774]" style={{ width: `${progress}%` }} />
      </div>
      <p className="mb-5 text-xs text-stone-600">
        {progress}% funded · ${formatMoney(remaining)} remaining
      </p>

      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-600">
        Choose amount
      </p>
      <div className="mb-3 grid grid-cols-4 gap-2">
        {PRESET_AMOUNTS.map((amount) => {
          const active = !customAmount && selectedAmount === amount;
          return (
            <button
              key={amount}
              type="button"
              onClick={() => {
                setSelectedAmount(amount);
                setCustomAmount("");
              }}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                active
                  ? "bg-[#9A432E] text-white"
                  : "bg-white text-stone-800 hover:bg-stone-100"
              }`}
            >
              ${amount}
            </button>
          );
        })}
      </div>

      <label className="mb-1 block text-xs uppercase tracking-wide text-stone-500">
        Custom amount ({currency})
      </label>
      <input
        type="text"
        inputMode="decimal"
        value={customAmount}
        onChange={(e) => handleCustomAmountChange(e.target.value)}
        placeholder="Custom amount"
        className="mb-2 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2D7774]"
      />
      {amountError ? (
        <p className="mb-3 text-xs text-red-600">{amountError}</p>
      ) : (
        <p className="mb-3 text-xs text-stone-500">
          You are donating ${formatMoney(finalAmount)} {currency}
        </p>
      )}

      <button
        type="button"
        disabled={!isValidAmount}
        className="w-full rounded-xl bg-[#1E6E6B] py-3 font-semibold text-white transition hover:bg-[#185b58] disabled:cursor-not-allowed disabled:opacity-50"
        onClick={handleDonate}
      >
        Donate ${isValidAmount ? formatMoney(finalAmount) : ""}
      </button>

      <div className="mt-4 flex items-center justify-between rounded-xl bg-[#DCD9D2] px-3 py-2">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-content-center rounded-full bg-stone-900 text-white">
            {/* simple Solana-esque mark */}
            <span className="text-xs font-bold">S</span>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-900">
              Powered by Solana
            </p>
            <p className="text-xs text-stone-700">Instant & Transparent</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-stone-700">
          <button type="button" className="rounded-md p-1 hover:bg-stone-200" aria-label="Share campaign">
            <Share2 className="h-4 w-4" />
          </button>
          <button type="button" className="rounded-md p-1 hover:bg-stone-200" aria-label="Donation info">
            <Info className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}