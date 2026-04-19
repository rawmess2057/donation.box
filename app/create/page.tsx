"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { WalletReadyState } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js";
import { Buffer } from "buffer";
import { createId } from "@/lib/campaigns";

const CATEGORIES = ["Education", "Emergency", "Nutrition", "Health", "Environment"];
const MEMO_PROGRAM_ID = new PublicKey(
  "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr",
);

export default function CreateCampaignPage() {
  const router = useRouter();
  const { connection } = useConnection();
  const { wallet, wallets, select, publicKey } = useWallet();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Education");
  const [story, setStory] = useState("");
  const [image, setImage] = useState("");
  const [goal, setGoal] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");

  const sanitizedGoal = useMemo(() => Number(goal), [goal]);

  const selectPhantomWallet = () => {
    const readyStates = new Set<WalletReadyState>([
      WalletReadyState.Installed,
      WalletReadyState.Loadable,
    ]);

    const phantom = wallets.find(
      (walletOption) =>
        walletOption.adapter.name === "Phantom" &&
        readyStates.has(walletOption.readyState),
    );

    const selected =
      wallet?.adapter.name === "Phantom" ? wallet : (phantom ?? null);

    if (selected) {
      select(selected.adapter.name);
    }

    return selected;
  };

  const handleCreateCampaign = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setStatus("");

    if (!title.trim() || !story.trim() || !goal.trim()) {
      setError("Please fill in title, story, and goal amount.");
      return;
    }
    if (!Number.isFinite(sanitizedGoal) || sanitizedGoal <= 0) {
      setError("Goal amount must be greater than 0 SOL.");
      return;
    }

    const selectedWallet = selectPhantomWallet();
    if (!selectedWallet) {
      setError(
        "Phantom wallet not detected. In Brave, disable Brave Wallet in settings, then refresh and try again.",
      );
      return;
    }

    setIsSubmitting(true);
    setStatus("Connecting wallet...");

    try {
      if (!selectedWallet.adapter.connected) {
        await selectedWallet.adapter.connect();
      }

      const creator = selectedWallet.adapter.publicKey ?? publicKey;
      if (!creator) {
        throw new Error("Wallet connection failed. Please try again.");
      }

      const payload = {
        app: "donate_blink",
        action: "create_campaign",
        title: title.trim(),
        category,
        story: story.trim().slice(0, 300),
        image: image.trim(),
        goal: sanitizedGoal,
        creator: creator.toBase58(),
        ts: Date.now(),
      };

      setStatus("Sending transaction on Solana devnet...");

      const memoIx = new TransactionInstruction({
        programId: MEMO_PROGRAM_ID,
        keys: [{ pubkey: creator, isSigner: true, isWritable: false }],
        data: Buffer.from(JSON.stringify(payload), "utf-8"),
      });

      const latestBlockhash = await connection.getLatestBlockhash();

      const transaction = new Transaction({
        feePayer: creator,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      }).add(memoIx);

      const signature = await selectedWallet.adapter.sendTransaction(
        transaction,
        connection,
      );

      await connection.confirmTransaction(
        {
          signature,
          blockhash: latestBlockhash.blockhash,
          lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        },
        "confirmed",
      );

      const campaignId = createId("campaign");
      const response = await fetch("/api/campaigns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: campaignId,
          title: title.trim(),
          subtitle: category,
          category,
          story: story.trim(),
          image: image.trim() || "/school.png",
          goal: sanitizedGoal,
          raised: 0,
          currency: "SOL",
          creator: creator.toBase58(),
          txSignature: signature,
          createdAt: new Date().toISOString(),
          verified: false,
        }),
      });

      if (!response.ok) {
        throw new Error("Campaign was created on devnet, but saving it in the app failed.");
      }

      setStatus("Campaign created on devnet. Redirecting to campaign...");
      router.push(`/campaign/${campaignId}`);
    } catch (createError) {
      const message =
        createError instanceof Error
          ? createError.message
          : "Failed to create campaign on devnet.";
      if (/rejected|declined|denied/i.test(message)) {
        setError("Wallet transaction was cancelled.");
      } else {
        setError(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-[#F7F3EC] min-h-screen py-14 pt-28 px-4">
      <section className="max-w-xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-serif font-bold text-[#9A432E]">
            Launch a Story
          </h1>
          <p className="mt-3 text-sm text-stone-600">
            Create a real campaign record backed by Solana devnet and publish it for shared testing.
          </p>
        </header>

        <form className="space-y-5" onSubmit={handleCreateCampaign}>
          <div className="rounded-2xl bg-[#F2EEE7] p-5">
            <h2 className="text-base font-semibold text-[#245B5B] mb-4">
              Campaign Identity
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wide text-stone-500 mb-1">
                  Campaign Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Classroom Supplies for Gorkha"
                  className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2D7774]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wide text-stone-500 mb-1">
                  Focus Area
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2D7774]"
                >
                  {CATEGORIES.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wide text-stone-500 mb-1">
                  The Story
                </label>
                <textarea
                  rows={4}
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  placeholder="Explain the impact of this campaign in 2-3 sentences."
                  className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2D7774]"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-[#F2EEE7] p-5">
            <h2 className="text-base font-semibold text-[#245B5B] mb-4">
              Visuals & Goal
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wide text-stone-500 mb-1">
                  Featured Image URL
                </label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://example.com/image.jpg (optional)"
                  className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2D7774]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wide text-stone-500 mb-1">
                  Goal Amount (SOL)
                </label>
                <input
                  type="number"
                  min={0.01}
                  step="0.01"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="2.5"
                  className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2D7774]"
                />
              </div>
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}
          {status && (
            <p className="rounded-lg bg-teal-50 px-3 py-2 text-sm text-teal-800">
              {status}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-[#2D7774] text-white font-semibold py-3 hover:bg-[#245f5d] transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Creating on Devnet..." : "Create Campaign on Devnet"}
          </button>
        </form>
      </section>
    </main>
  );
}
