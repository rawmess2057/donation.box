"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, type Variants, AnimatePresence } from "framer-motion";
import { WalletReadyState } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js";
import { Buffer } from "buffer";
import { createId } from "@/lib/campaigns";
import { getNetworkLabel, getCreateActionLabel } from "@/lib/explorer";
import PartnerGuard from "@/components/PartnerGuard";

const CATEGORIES = ["Education", "Emergency", "Nutrition", "Health", "Environment"];
const MEMO_PROGRAM_ID = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");

const headingVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const headingItem: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 100, damping: 14 },
  },
};

const sectionSlideLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring" as const, stiffness: 80, damping: 13 },
  },
};

const sectionSlideRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring" as const, stiffness: 80, damping: 13, delay: 0.1 },
  },
};

const statusVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 150, damping: 16 },
  },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

const glassSection =
  "bg-gradient-to-br from-primary/[0.04] via-transparent to-accent/[0.02] backdrop-blur-2xl border border-white/10 rounded-2xl p-5";

const inputBase =
  "w-full rounded-xl bg-white/[0.04] backdrop-blur-xl border border-white/15 px-3 py-2.5 text-sm outline-none transition-all duration-300 focus:border-primary/50 focus:shadow-[0_0_12px_rgba(127,191,127,0.1)] text-fg placeholder:text-fg-subtle/60";

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
  const [impactDescription, setImpactDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");

  const sanitizedGoal = useMemo(() => Number(goal), [goal]);

  const handleFileSelect = (file: File) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      setError("Invalid file type. Use PNG, JPEG, WebP or GIF.");
      return;
    }
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

    const selected = wallet?.adapter.name === "Phantom" ? wallet : (phantom ?? null);

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
      setError("Phantom wallet not detected. In Brave, disable Brave Wallet in settings, then refresh and try again.");
      return;
    }

    let finalImage = image.trim();
    if (uploadMode === "file" && imageFile && imagePreview) {
      setIsUploading(true);
      setStatus("Uploading image...");
      try {
        const uploadForm = new FormData();
        uploadForm.append("file", imageFile);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: uploadForm });
        if (!uploadRes.ok) {
          const err = (await uploadRes.json()) as { error?: string };
          throw new Error(err.error ?? "Failed to upload image");
        }
        const { url } = (await uploadRes.json()) as { url: string };
        finalImage = url;
      } catch (uploadError) {
        const msg = uploadError instanceof Error ? uploadError.message : "Failed to upload image.";
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

      const signature = await selectedWallet.adapter.sendTransaction(transaction, connection);

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
        headers: { "Content-Type": "application/json" },
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
          impactDescription: impactDescription.trim() || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(`Campaign was created on ${getNetworkLabel()}, but saving it in the app failed.`);
      }

      setStatus(`Campaign created on ${getNetworkLabel()}. Redirecting...`);
      router.push(`/campaign/${campaignId}`);
    } catch (createError) {
      const message = createError instanceof Error ? createError.message : `Failed to create campaign on ${getNetworkLabel()}.`;
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
    <PartnerGuard>
      <main className="bg-bg min-h-screen py-14 pt-10 px-4 relative overflow-hidden">
        {/* Solana background shapes */}
        <motion.div
          className="absolute top-[8%] right-[2%] w-[160px] h-[60px] pointer-events-none z-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(127,191,127,0.12), rgba(127,191,127,0.03))",
            clipPath: "polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)",
          }}
          animate={{ x: [0, -18, 12, 0], y: [0, 8, -6, 0], rotate: [0, 3, -2, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[15%] left-[1%] w-[180px] h-[180px] pointer-events-none z-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(3,225,255,0.08), rgba(3,225,255,0.02))",
            clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
          }}
          animate={{ x: [0, 14, -10, 0], y: [0, -12, 8, 0], rotate: [0, 5, -3, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
        <motion.div
          className="absolute top-[45%] right-[1%] w-[180px] h-[35px] pointer-events-none z-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(220,31,255,0.07), rgba(220,31,255,0.02))",
            clipPath: "polygon(0% 0%, 70% 0%, 100% 100%, 30% 100%)",
          }}
          animate={{ x: [0, 22, -10, 0], scale: [1, 1.06, 0.96, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute bottom-[5%] right-[5%] w-[150px] h-[130px] pointer-events-none z-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(127,191,127,0.06), rgba(220,31,255,0.03))",
            clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
          }}
          animate={{ x: [0, -12, 8, 0], y: [0, 10, -6, 0], rotate: [0, -3, 2, 0] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        />

        <div className="relative z-[2]">
          <section className="max-w-xl mx-auto">
            <motion.header
              variants={headingVariants}
              initial="hidden"
              animate="visible"
              className="text-center mb-8"
            >
              <motion.h1
                variants={headingItem}
                className="text-5xl font-bold font-[family-name:var(--font-heading)]"
              >
                Launch a{" "}
                <span
                  className="bg-gradient-to-r from-primary via-accent to-success bg-clip-text text-transparent animate-shimmer"
                  style={{ backgroundSize: "200% 100%" }}
                >
                  Story
                </span>
              </motion.h1>
              <motion.p
                variants={headingItem}
                className="mt-3 text-sm text-fg-muted"
              >
                Create a real campaign record backed by Solana {getNetworkLabel()} and publish it for shared testing.
              </motion.p>
            </motion.header>

            <motion.form
              className="space-y-5"
              onSubmit={handleCreateCampaign}
              variants={headingVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={sectionSlideLeft} className={glassSection}>
                <h2 className="text-base font-semibold text-fg mb-4 font-[family-name:var(--font-heading)]">
                  Campaign Identity
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wide text-fg-subtle mb-1">
                      Campaign Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Classroom Supplies for Gorkha"
                      className={inputBase}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wide text-fg-subtle mb-1">
                      Focus Area
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className={inputBase}
                    >
                      {CATEGORIES.map((item) => (
                        <option key={item} className="bg-bg">{item}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wide text-fg-subtle mb-1">
                      The Story
                    </label>
                    <textarea
                      rows={4}
                      value={story}
                      onChange={(e) => setStory(e.target.value)}
                      placeholder="Explain the impact of this campaign in 2-3 sentences."
                      className={`${inputBase} resize-none`}
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div variants={sectionSlideRight} className={glassSection}>
                <h2 className="text-base font-semibold text-fg mb-4 font-[family-name:var(--font-heading)]">
                  Visuals &amp; Goal
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wide text-fg-subtle mb-1">
                      Featured Image
                    </label>

                    <div className="flex gap-2 mb-3">
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setUploadMode("url")}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-300 ${
                          uploadMode === "url"
                            ? "bg-accent/20 backdrop-blur-xl border border-accent/40 text-accent shadow-[0_0_15px_rgba(3,225,255,0.2)]"
                            : "bg-white/[0.04] backdrop-blur-xl border border-white/10 text-fg-muted hover:text-fg"
                        }`}
                      >
                        URL
                      </motion.button>
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setUploadMode("file")}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-300 ${
                          uploadMode === "file"
                            ? "bg-accent/20 backdrop-blur-xl border border-accent/40 text-accent shadow-[0_0_15px_rgba(3,225,255,0.2)]"
                            : "bg-white/[0.04] backdrop-blur-xl border border-white/10 text-fg-muted hover:text-fg"
                        }`}
                      >
                        Upload from device
                      </motion.button>
                    </div>

                    {uploadMode === "url" ? (
                      <input
                        type="url"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        placeholder="https://example.com/image.jpg (optional)"
                        className={inputBase}
                      />
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("border-primary/50", "shadow-[0_0_15px_rgba(127,191,127,0.1)]"); }}
                        onDragLeave={(e) => { e.currentTarget.classList.remove("border-primary/50", "shadow-[0_0_15px_rgba(127,191,127,0.1)]"); }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.currentTarget.classList.remove("border-primary/50", "shadow-[0_0_15px_rgba(127,191,127,0.1)]");
                          const file = e.dataTransfer.files[0];
                          if (file) handleFileSelect(file);
                        }}
                        className="relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/15 bg-white/[0.04] backdrop-blur-xl px-4 py-6 text-center transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_15px_rgba(127,191,127,0.1)]"
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          className="hidden"
                          onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFileSelect(file); }}
                        />

                        {imagePreview ? (
                          <div className="relative w-full">
                            <img src={imagePreview} alt="Preview" className="mx-auto max-h-48 rounded-lg object-contain" />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setImageFile(null);
                                setImagePreview(null);
                                if (fileInputRef.current) fileInputRef.current.value = "";
                              }}
                              className="absolute top-1 right-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <>
                            <motion.svg
                              className="mb-2 h-8 w-8 text-fg-subtle"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={1.5}
                              animate={{ scale: [1, 1.05, 1] }}
                              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                            </motion.svg>
                            <p className="text-sm font-medium text-fg-muted">Click to upload or drag &amp; drop</p>
                            <p className="mt-1 text-xs text-fg-subtle">PNG, JPEG, WebP or GIF (max 5 MB)</p>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wide text-fg-subtle mb-1">
                      What does 1 SOL provide? <span className="text-fg-subtle font-normal normal-case">(optional)</span>
                    </label>
                    <textarea
                      rows={2}
                      value={impactDescription}
                      onChange={(e) => setImpactDescription(e.target.value)}
                      placeholder="e.g. school supplies for 20 children, or 3 emergency kits"
                      className={`${inputBase} resize-none`}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wide text-fg-subtle mb-1">
                      Goal Amount (SOL)
                    </label>
                    <input
                      type="number"
                      min={0.01}
                      step="0.01"
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      placeholder="2.5"
                      className={inputBase}
                    />
                  </div>
                </div>
              </motion.div>

              <AnimatePresence mode="wait">
                {error && (
                  <motion.p
                    key="error"
                    variants={statusVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="rounded-lg bg-red-950/30 backdrop-blur-xl border border-red-800/50 px-3 py-2 text-sm text-red-400"
                  >
                    {error}
                  </motion.p>
                )}
                {status && !error && (
                  <motion.p
                    key="status"
                    variants={statusVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="rounded-lg bg-accent/[0.08] backdrop-blur-xl border border-accent/30 px-3 py-2 text-sm text-accent"
                  >
                    {status}
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={isSubmitting || isUploading}
                whileTap={{ scale: 0.98 }}
                className="w-full rounded-xl bg-white/[0.04] backdrop-blur-2xl border border-white/20 text-white font-bold py-3.5 transition-all duration-500 ease-out disabled:cursor-not-allowed disabled:opacity-60 shadow-[0_0_15px_rgba(3,225,255,0.1)] hover:shadow-[0_0_40px_rgba(3,225,255,0.25)] hover:border-accent/50 hover:bg-accent/15"
              >
                {isSubmitting ? getCreateActionLabel() : `Create Campaign on ${getNetworkLabel()}`}
              </motion.button>
            </motion.form>
          </section>
        </div>
      </main>
    </PartnerGuard>
  );
}
