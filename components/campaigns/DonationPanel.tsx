"use client";

import { useMemo, useState } from "react";

type DonationPanelProps = {
  raised: number;
  goal: number;
  currency?: "USDC" | "USD";
};

const PRESET_AMOUNTS = [5, 10, 25];

export default function DonationPanel({
  raised,
  goal,
  currency = "USDC",
}: DonationPanelProps) {
  const [selectedAmount, setSelectedAmount] = useState<number>(10);
  const [customAmount, setCustomAmount] = useState<string>("");

  const progress = useMemo(() => {
    if (goal <= 0) return 0;
    return Math.min(100, Math.round((raised / goal) * 100));
  }, [raised, goal]);

  const finalAmount = customAmount.trim() ? Number(customAmount) : selectedAmount;
  const isValidAmount = Number.isFinite(finalAmount) && finalAmount > 0;

  return (
    <aside className="rounded-2xl bg-[#F2EEE7] p-5 shadow-sm">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-stone-500">Raised</p>
          <p className="text-2xl font-bold text-[#9A432E]">
            ${raised.toLocaleString()} <span className="text-sm">{currency}</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wide text-stone-500">Goal</p>
          <p className="text-xl font-semibold text-stone-900">
            ${goal.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mb-2 h-2 w-full rounded bg-stone-300">
        <div
          className="h-2 rounded bg-[#2D7774]"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mb-5 text-xs text-stone-600">{progress}% of goal reached</p>

      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-600">
        Choose amount
      </p>
      <div className="mb-3 grid grid-cols-3 gap-2">
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
              <span className="ml-1 text-[10px] opacity-80">{currency}</span>
            </button>
          );
        })}
      </div>

      <label className="mb-1 block text-xs uppercase tracking-wide text-stone-500">
        Custom amount
      </label>
      <input
        type="number"
        min={1}
        value={customAmount}
        onChange={(e) => setCustomAmount(e.target.value)}
        placeholder="Custom amount"
        className="mb-4 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2D7774]"
      />

      <button
        type="button"
        disabled={!isValidAmount}
        className="w-full rounded-xl bg-[#1E6E6B] py-3 font-semibold text-white transition hover:bg-[#185b58] disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => {
          // TODO: replace with wallet/payment flow
          alert(`Proceeding to donate $${finalAmount} ${currency}`);
        }}
      >
        Give ${isValidAmount ? finalAmount : ""}
      </button>

      <p className="mt-3 text-center text-[11px] uppercase tracking-wide text-stone-500">
        Powered by Solana
      </p>
    </aside>
  );
}