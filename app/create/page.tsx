"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { WalletReadyState } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js";
import { Buffer } from "buffer";
import { createId } from "@/lib/campaigns";
import { getNetworkLabel, getCreateActionLabel } from "@/lib/explorer";

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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadMode, setUploadMode] = useState<"url" | "file">("url");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [goal, setGoal] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");

  const sanitizedGoal = useMemo(() => Number(goal), [goal]);

  const handleFileSelect = (file: File) => {
    // Validate file type
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      setError("Invalid file type. Use PNG, JPEG, WebP or GIF.");
      return;
    }
    // Validate file size (5 MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File too large. Maximum size is 5 MB.");
      return;
    }
    setError("");
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

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

    // Upload image file first if in file mode
    let finalImage = image.trim();
    if (uploadMode === "file" && imageFile && imagePreview) {
      setIsUploading(true);
      setStatus("Uploading image...");
      try {
        const uploadForm = new FormData();
        uploadForm.append("file", imageFile);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadForm,
        });
        if (!uploadRes.ok) {
          const err = (await uploadRes.json()) as { error?: string };
          throw new Error(err.error ?? "Failed to upload image");
        }
        const { url } = (await uploadRes.json()) as { url: string };
        finalImage = url;
      } catch (uploadError) {
        const msg =
          uploadError instanceof Error
            ? uploadError.message
            : "Failed to upload image.";
        setError(msg);
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    } else if (uploadMode === "url") {
      finalImage = image.trim();
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
        image: finalImage,
        goal: sanitizedGoal,
        creator: creator.toBase58(),
        ts: Date.now(),
      };

      setStatus(`Sending transaction on Solana ${getNetworkLabel()}...`);

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
          image: finalImage || "/school.png",
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
        throw new Error(`Campaign was created on ${getNetworkLabel()}, but saving it in the app failed.`);
      }

      setStatus(`Campaign created on ${getNetworkLabel()}. Redirecting to campaign...`);
      router.push(`/campaign/${campaignId}`);
    } catch (createError) {
      const message =
        createError instanceof Error
          ? createError.message
          : `Failed to create campaign on ${getNetworkLabel()}.`;
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
            Create a real campaign record backed by Solana ${getNetworkLabel()} and publish it for shared testing.
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
                  Featured Image
                </label>

                {/* Mode toggle */}
                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setUploadMode("url")}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      uploadMode === "url"
                        ? "bg-[#2D7774] text-white"
                        : "bg-white text-stone-600 hover:bg-stone-100"
                    }`}
                  >
                    URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadMode("file")}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      uploadMode === "file"
                        ? "bg-[#2D7774] text-white"
                        : "bg-white text-stone-600 hover:bg-stone-100"
                    }`}
                  >
                    Upload from device
                  </button>
                </div>

                {uploadMode === "url" ? (
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://example.com/image.jpg (optional)"
                    className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2D7774]"
                  />
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.add("border-[#2D7774]");
                    }}
                    onDragLeave={(e) => {
                      e.currentTarget.classList.remove("border-[#2D7774]");
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove("border-[#2D7774]");
                      const file = e.dataTransfer.files[0];
                      if (file) handleFileSelect(file);
                    }}
                    className="relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-stone-300 bg-white px-4 py-6 text-center transition hover:border-stone-400"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileSelect(file);
                      }}
                    />

                    {imagePreview ? (
                      <div className="relative w-full">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="mx-auto max-h-48 rounded-lg object-contain"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setImageFile(null);
                            setImagePreview(null);
                            if (fileInputRef.current)
                              fileInputRef.current.value = "";
                          }}
                          className="absolute top-1 right-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <>
                        <svg
                          className="mb-2 h-8 w-8 text-stone-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                          />
                        </svg>
                        <p className="text-sm font-medium text-stone-600">
                          Click to upload or drag & drop
                        </p>
                        <p className="mt-1 text-xs text-stone-400">
                          PNG, JPEG, WebP or GIF (max 5 MB)
                        </p>
                      </>
                    )}
                  </div>
                )}
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
            disabled={isSubmitting || isUploading}
            className="w-full rounded-xl bg-[#2D7774] text-white font-semibold py-3 hover:bg-[#245f5d] transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? getCreateActionLabel() : `Create Campaign on ${getNetworkLabel()}`}
          </button>
        </form>
      </section>
    </main>
  );
}
