"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";
import type { ActionGetResponse } from "@/lib/solana-actions";
import { getExplorerTxUrl } from "@/lib/explorer";
import { generateBlinkUrl } from "@/lib/blinkGenerator";
import {
  fadeInUp,
  springTransition,
  staggerChildren,
} from "@/lib/design-system/animations";
import {
  ExternalLink,
  Copy,
  CheckCircle,
  Code2,
  Bug,
  Wallet,
  Zap,
  Terminal,
  AlertTriangle,
  ArrowUpRight,
} from "lucide-react";

export default function BlinkPreviewPage() {
  const params = useParams();
  const id = params.id as string;
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();

  const [action, setAction] = useState<ActionGetResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [selectedAction, setSelectedAction] = useState<number | null>(null);
  const [postResult, setPostResult] = useState<{
    status: number;
    data: unknown;
  } | null>(null);
  const [postLoading, setPostLoading] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [copiedTx, setCopiedTx] = useState(false);
  const [txState, setTxState] = useState<"idle" | "signing" | "sending" | "confirming" | "success" | "error">("idle");
  const [txSignature, setTxSignature] = useState<string | null>(null);
  const [txSignError, setTxSignError] = useState<string | null>(null);

  const blinkUrl = useMemo(() => generateBlinkUrl(id), [id]);
  const dialToUrl = useMemo(
    () =>
      `https://dial.to/?action=solana-action:${encodeURIComponent(blinkUrl)}`,
    [blinkUrl],
  );

  useEffect(() => {
    let active = true;

    async function loadAction() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/actions/donate?campaignId=${encodeURIComponent(id)}`);
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(
            (errData as { error?: string }).error || `HTTP ${res.status}`,
          );
        }
        const data = (await res.json()) as ActionGetResponse;
        if (active) setAction(data);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void loadAction();
    return () => {
      active = false;
    };
  }, [id]);

  const resolveHref = useCallback(
    (actionIdx: number): string | null => {
      if (!action?.links?.actions) return null;
      const act = action.links.actions[actionIdx];
      if (!act) return null;

      let href = act.href;
      if (act.parameters && act.parameters.length > 0) {
        const amountParam = act.parameters.find((p) => p.name === "amount");
        if (amountParam) {
          if (!customAmount) return null;
          href = href.replace("{amount}", customAmount);
        }
      }
      return href;
    },
    [action, customAmount],
  );

  const testAction = useCallback(
    async (actionIdx: number) => {
      if (!publicKey) {
        setPostError("Connect your wallet first to test actions");
        return;
      }
      setPostResult(null);
      setPostError(null);
      setSelectedAction(actionIdx);

      const href = resolveHref(actionIdx);
      if (!href) {
        setPostError("Missing amount for custom action");
        return;
      }

      setPostLoading(true);
      try {
        const res = await fetch(href, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ account: publicKey.toBase58() }),
        });
        const data = await res.json();
        setPostResult({ status: res.status, data });
      } catch (err) {
        setPostError(err instanceof Error ? err.message : "POST request failed");
      } finally {
        setPostLoading(false);
      }
    },
    [publicKey, resolveHref],
  );

  const handleCopyBlinkUrl = async () => {
    try {
      await navigator.clipboard.writeText(blinkUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch {
      // silent
    }
  };

  const handleCopyTx = async () => {
    if (
      postResult?.data &&
      typeof postResult.data === "object" &&
      "transaction" in (postResult.data as Record<string, unknown>)
    ) {
      try {
        await navigator.clipboard.writeText(
          (postResult.data as { transaction: string }).transaction,
        );
        setCopiedTx(true);
        setTimeout(() => setCopiedTx(false), 2000);
      } catch {
        // silent
      }
    }
  };

  const handleSignAndSend = async () => {
    if (!postResult?.data || !signTransaction) return;

    setTxState("signing");
    setTxSignError(null);
    setTxSignature(null);

    try {
      const data = postResult.data as { transaction: string };
      const binaryStr = atob(data.transaction);
      const bytes = new Uint8Array(binaryStr.length);
      for (let i = 0; i < binaryStr.length; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }

      const tx = Transaction.from(bytes);

      setTxState("sending");
      const signedTx = await signTransaction(tx);

      setTxState("confirming");
      const signature = await connection.sendRawTransaction(signedTx.serialize(), {
        skipPreflight: false,
      });

      const latestBlockhash = await connection.getLatestBlockhash();
      await connection.confirmTransaction(
        { signature, blockhash: latestBlockhash.blockhash, lastValidBlockHeight: latestBlockhash.lastValidBlockHeight },
        "confirmed",
      );

      setTxSignature(signature);
      setTxState("success");
    } catch (err) {
      setTxSignError(err instanceof Error ? err.message : "Transaction failed");
      setTxState("error");
    }
  };

  const hasValidTransaction = useMemo(() => {
    if (!postResult?.data) return false;
    if (typeof postResult.data !== "object") return false;
    if (!("transaction" in (postResult.data as Record<string, unknown>))) return false;
    return postResult.status >= 200 && postResult.status < 300;
  }, [postResult]);

  const shouldShowCustomInput = useMemo(() => {
    if (selectedAction === null || !action?.links?.actions) return false;
    const act = action.links.actions[selectedAction];
    return act?.parameters?.some((p) => p.name === "amount") ?? false;
  }, [selectedAction, action]);

  return (
    <main className="min-h-screen bg-bg relative overflow-hidden">
      <motion.div
        className="absolute top-[5%] right-[3%] w-[220px] h-[220px] pointer-events-none z-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(127,191,127,0.1), rgba(127,191,127,0.03))",
          clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
        }}
        animate={{ x: [0, -18, 12, 0], y: [0, 14, -10, 0], rotate: [0, 6, -4, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[20%] left-[2%] w-[160px] h-[130px] pointer-events-none z-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(3,225,255,0.07), rgba(220,31,255,0.03))",
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
        }}
        animate={{ x: [0, 16, -10, 0], y: [0, -12, 8, 0], rotate: [0, -4, 3, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
      />
      <motion.div
        className="absolute top-[40%] right-[8%] w-[100px] h-[120px] pointer-events-none z-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(220,31,255,0.06), rgba(127,191,127,0.02))",
          clipPath:
            "polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)",
        }}
        animate={{ x: [0, -8, 6, 0], y: [0, 8, -5, 0], rotate: [0, -2, 3, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      />

      <div className="relative max-w-6xl mx-auto px-4 pt-10 pb-10 z-[2]">
        {isLoading ? (
          <div className="py-20 text-center relative">
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] h-[160px] pointer-events-none"
              style={{
                background:
                  "linear-gradient(135deg, rgba(127,191,127,0.08), rgba(3,225,255,0.03))",
                clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
              }}
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-full glass-surface mb-4">
              <div className="w-6 h-6 border-[3px] border-border border-t-primary rounded-full animate-spin" />
            </div>
            <p className="text-fg-muted text-sm">
              Loading{" "}
              <span
                className="bg-gradient-to-r from-primary via-accent to-success bg-clip-text text-transparent animate-shimmer"
                style={{ backgroundSize: "200% 100%" }}
              >
                blink
              </span>
              ...
            </p>
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 14 }}
            className="text-center py-20"
          >
            <div className="inline-block bg-gradient-to-br from-primary/[0.06] via-transparent to-accent/[0.04] backdrop-blur-2xl border border-white/10 rounded-2xl p-8 max-w-sm mx-auto">
              <div className="flex justify-center mb-4">
                <AlertTriangle size={40} className="text-warning" />
              </div>
              <h1 className="text-2xl font-bold text-fg font-[family-name:var(--font-heading)]">
                <span className="bg-gradient-to-r from-primary via-accent to-success bg-clip-text text-transparent">
                  Blink
                </span>{" "}
                not available
              </h1>
              <p className="mt-2 text-fg-muted text-sm">{error}</p>
              <Link
                href="/explore"
                className="inline-block mt-4 text-sm font-semibold text-accent hover:text-accent-hover transition-colors duration-300"
              >
                Browse campaigns &rarr;
              </Link>
            </div>
          </motion.div>
        ) : action ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerChildren}
            className="space-y-6"
          >
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-fg leading-tight font-[family-name:var(--font-heading)]">
                  <span className="bg-gradient-to-r from-primary via-accent to-success bg-clip-text text-transparent">
                    Blink Preview
                  </span>
                </h1>
                <p className="text-fg-muted text-sm mt-1 font-[family-name:var(--font-heading)]">
                  Campaign: {action.title}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleCopyBlinkUrl}
                  className="flex items-center gap-2 rounded-xl bg-white/[0.04] backdrop-blur-2xl border border-white/20 text-fg px-3 py-2 text-sm font-semibold transition-all duration-500 ease-out hover:shadow-[0_0_40px_rgba(3,225,255,0.25)] hover:border-accent/50 hover:text-white hover:bg-accent/15 active:scale-95"
                  title="Copy Blink URL"
                >
                  {copiedUrl ? (
                    <CheckCircle size={16} className="text-success" />
                  ) : (
                    <Copy size={16} />
                  )}
                  <span>{copiedUrl ? "Copied!" : "Copy URL"}</span>
                </button>

                <a
                  href={dialToUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-xl bg-white/[0.04] backdrop-blur-2xl border border-white/20 text-fg px-3 py-2 text-sm font-semibold transition-all duration-500 ease-out hover:shadow-[0_0_40px_rgba(127,191,127,0.25)] hover:border-primary/50 hover:text-white hover:bg-primary/15 active:scale-95"
                >
                  <ExternalLink size={16} />
                  <span>Dial.to</span>
                </a>

                <Link
                  href={`/campaign/${id}`}
                  className="flex items-center gap-2 rounded-xl bg-white/[0.04] backdrop-blur-2xl border border-white/20 text-fg px-3 py-2 text-sm font-semibold transition-all duration-500 ease-out hover:shadow-[0_0_40px_rgba(220,31,255,0.25)] hover:border-accent-hover/50 hover:text-white hover:bg-accent-hover/15 active:scale-95"
                >
                  <ExternalLink size={16} />
                  <span>Campaign</span>
                </Link>
              </div>
            </motion.div>

            <div className="grid gap-6 lg:grid-cols-2">
              <motion.div variants={fadeInUp} className="space-y-4">
                <div className="bg-gradient-to-br from-primary/[0.04] via-transparent to-accent/[0.02] backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden">
                  <div className="border-b border-white/10 px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap size={16} className="text-accent" />
                      <h2 className="text-sm font-semibold text-fg font-[family-name:var(--font-heading)]">
                        Blink Card Preview
                      </h2>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider text-fg-subtle bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/10">
                      Wallet View
                    </span>
                  </div>

                  <div className="p-5 space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 w-16 h-16 rounded-xl overflow-hidden border border-white/10 bg-white/[0.04]">
                        {action.icon && (
                          <Image
                            src={action.icon}
                            alt={action.title}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg font-bold text-fg leading-tight font-[family-name:var(--font-heading)]">
                          {action.title}
                        </h3>
                        <p className="text-xs text-fg-muted mt-1">{action.label}</p>
                      </div>
                    </div>

                    <p className="text-sm text-fg-muted leading-relaxed font-[family-name:var(--font-heading)] line-clamp-4">
                      {action.description}
                    </p>

                    {action.links?.actions && (
                      <div className="space-y-2 pt-2 border-t border-white/10">
                        <p className="text-[10px] uppercase tracking-wider text-fg-subtle font-semibold">
                          Donate Actions
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {action.links.actions.map((act, idx) => {
                            const isCustom = act.parameters?.some(
                              (p) => p.name === "amount",
                            );
                            const isSelected = selectedAction === idx;
                            return (
                              <button
                                key={idx}
                                onClick={() => {
                                  if (isCustom) {
                                    setSelectedAction(idx);
                                  } else {
                                    void testAction(idx);
                                  }
                                }}
                                disabled={postLoading}
                                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 border ${
                                  isSelected
                                    ? "border-primary/60 bg-primary/10 text-primary shadow-[0_0_20px_rgba(127,191,127,0.2)]"
                                    : "border-white/10 bg-white/[0.04] text-fg hover:border-primary/30 hover:bg-primary/[0.06] hover:text-primary"
                                } disabled:opacity-40 disabled:cursor-not-allowed`}
                              >
                                {act.label}
                              </button>
                            );
                          })}
                        </div>

                        <AnimatePresence>
                          {shouldShowCustomInput && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="flex items-center gap-2 pt-1"
                            >
                              <input
                                type="number"
                                step="0.01"
                                min="0.001"
                                placeholder="Enter SOL amount"
                                value={customAmount}
                                onChange={(e) => setCustomAmount(e.target.value)}
                                className="flex-1 rounded-xl bg-white/[0.04] backdrop-blur-xl border border-white/10 px-3 py-2 text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:border-primary/50 focus:shadow-[0_0_15px_rgba(127,191,127,0.15)] transition-all duration-300 font-[family-name:var(--font-heading)]"
                              />
                              <button
                                onClick={() => {
                                  if (selectedAction !== null)
                                    void testAction(selectedAction);
                                }}
                                disabled={!customAmount || postLoading}
                                className="px-4 py-2 rounded-xl bg-accent/20 border border-accent/30 text-accent text-xs font-semibold transition-all duration-300 hover:bg-accent/30 hover:shadow-[0_0_20px_rgba(3,225,255,0.2)] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                Test
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                      <Wallet size={14} className="text-fg-subtle" />
                      <span className="text-xs text-fg-subtle">
                        {publicKey
                          ? `Wallet: ${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
                          : "Wallet not connected — POST test requires a connected wallet"}
                      </span>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {postLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="rounded-xl bg-white/[0.04] backdrop-blur-2xl border border-white/10 p-4 flex items-center gap-3"
                    >
                      <div className="w-4 h-4 border-[2px] border-border border-t-accent rounded-full animate-spin" />
                      <span className="text-sm text-fg-muted font-[family-name:var(--font-heading)]">
                        Sending POST request...
                      </span>
                    </motion.div>
                  )}

                  {postError && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="rounded-xl bg-warning/[0.08] border border-warning/20 p-4"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle size={16} className="text-warning shrink-0" />
                        <span className="text-sm font-semibold text-warning font-[family-name:var(--font-heading)]">
                          POST Error
                        </span>
                      </div>
                      <p className="text-xs text-fg-muted">{postError}</p>
                    </motion.div>
                  )}

                  {postResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="rounded-xl bg-white/[0.04] backdrop-blur-2xl border border-white/10 overflow-hidden"
                    >
                      <div className="border-b border-white/10 px-4 py-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Terminal size={14} className="text-accent" />
                          <span className="text-sm font-semibold text-fg font-[family-name:var(--font-heading)]">
                            POST Response
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                              postResult.status >= 200 && postResult.status < 300
                                ? "bg-success/20 text-success"
                                : "bg-warning/20 text-warning"
                            }`}
                          >
                            {postResult.status}
                          </span>
                        </div>
                        {hasValidTransaction && (
                            <button
                              onClick={handleCopyTx}
                              className="flex items-center gap-1.5 text-xs text-fg-muted hover:text-accent transition-colors"
                            >
                              {copiedTx ? (
                                <CheckCircle size={14} className="text-success" />
                              ) : (
                                <Copy size={14} />
                              )}
                              {copiedTx ? "Copied" : "Copy Tx"}
                            </button>
                          )}
                      </div>
                      <pre className="p-4 text-xs text-fg-muted overflow-x-auto font-mono leading-relaxed max-h-48 overflow-y-auto">
                        {JSON.stringify(postResult.data, null, 2)}
                      </pre>
                    </motion.div>
                  )}
                </AnimatePresence>

                {hasValidTransaction && (
                    <AnimatePresence mode="wait">
                      {txState === "idle" && (
                        <motion.div
                          key="idle"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <button
                            onClick={handleSignAndSend}
                            disabled={!signTransaction}
                            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent/20 to-primary/20 border border-accent/30 text-accent px-4 py-3 text-sm font-semibold transition-all duration-500 ease-out hover:shadow-[0_0_40px_rgba(3,225,255,0.3)] hover:border-accent/60 hover:text-white hover:bg-accent/20 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Zap size={18} />
                            Sign & Send Transaction
                          </button>
                          {!signTransaction && (
                            <p className="text-xs text-warning mt-2 text-center">
                              Wallet does not support signing transactions
                            </p>
                          )}
                        </motion.div>
                      )}

                      {txState === "signing" && (
                        <motion.div
                          key="signing"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="rounded-xl bg-white/[0.04] backdrop-blur-2xl border border-white/10 p-4 space-y-2"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 border-[2px] border-border border-t-accent rounded-full animate-spin" />
                            <span className="text-sm text-fg font-[family-name:var(--font-heading)]">
                              Approve transaction in your wallet...
                            </span>
                          </div>
                          <p className="text-xs text-fg-subtle pl-8">
                            Check Phantom or Backpack extension
                          </p>
                        </motion.div>
                      )}

                      {txState === "sending" && (
                        <motion.div
                          key="sending"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="rounded-xl bg-white/[0.04] backdrop-blur-2xl border border-white/10 p-4 flex items-center gap-3"
                        >
                          <div className="w-5 h-5 border-[2px] border-border border-t-primary rounded-full animate-spin" />
                          <span className="text-sm text-fg font-[family-name:var(--font-heading)]">
                            Sending to devnet...
                          </span>
                        </motion.div>
                      )}

                      {txState === "confirming" && (
                        <motion.div
                          key="confirming"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="rounded-xl bg-white/[0.04] backdrop-blur-2xl border border-white/10 p-4 flex items-center gap-3"
                        >
                          <div className="w-5 h-5 border-[2px] border-border border-t-success rounded-full animate-spin" />
                          <span className="text-sm text-fg font-[family-name:var(--font-heading)]">
                            Waiting for confirmation...
                          </span>
                        </motion.div>
                      )}

                      {txState === "success" && txSignature && (
                        <motion.div
                          key="success"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="rounded-xl bg-success/[0.08] border border-success/30 p-4 space-y-3"
                        >
                          <div className="flex items-center gap-2">
                            <CheckCircle size={18} className="text-success shrink-0" />
                            <span className="text-sm font-semibold text-success font-[family-name:var(--font-heading)]">
                              Transaction Confirmed
                            </span>
                          </div>
                          <div className="bg-black/30 rounded-lg p-3">
                            <p className="text-[10px] uppercase tracking-wider text-fg-subtle mb-1">
                              Signature
                            </p>
                            <p className="text-xs font-mono text-fg-muted break-all">
                              {txSignature}
                            </p>
                          </div>
                          <a
                            href={getExplorerTxUrl(txSignature)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-hover transition-colors"
                          >
                            View on Solana Explorer
                            <ArrowUpRight size={14} />
                          </a>
                        </motion.div>
                      )}

                      {txState === "error" && (
                        <motion.div
                          key="error"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="rounded-xl bg-warning/[0.08] border border-warning/20 p-4 space-y-3"
                        >
                          <div className="flex items-center gap-2">
                            <AlertTriangle size={16} className="text-warning shrink-0" />
                            <span className="text-sm font-semibold text-warning font-[family-name:var(--font-heading)]">
                              Transaction Failed
                            </span>
                          </div>
                          <p className="text-xs text-fg-muted">{txSignError}</p>
                          <button
                            onClick={() => setTxState("idle")}
                            className="text-xs font-semibold text-accent hover:text-accent-hover transition-colors"
                          >
                            Try again &rarr;
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}

              </motion.div>

              <motion.div variants={fadeInUp}>
                <details className="group bg-gradient-to-br from-primary/[0.04] via-transparent to-accent/[0.02] backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden">
                  <summary className="flex items-center justify-between px-5 py-3 cursor-pointer hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-2">
                      <Code2 size={16} className="text-accent" />
                      <h2 className="text-sm font-semibold text-fg font-[family-name:var(--font-heading)]">
                        Raw ActionGetResponse
                      </h2>
                    </div>
                    <Bug size={14} className="text-fg-subtle group-open:rotate-180 transition-transform duration-300" />
                  </summary>
                  <div className="border-t border-white/10">
                    <div className="flex items-center justify-between px-5 py-2 bg-white/[0.02]">
                      <span className="text-[10px] uppercase tracking-wider text-fg-subtle">
                        GET /api/actions/donate
                      </span>
                      <span className="text-[10px] text-success bg-success/10 px-2 py-0.5 rounded-full">
                        200 OK
                      </span>
                    </div>
                    <pre className="p-5 text-xs text-fg-muted overflow-x-auto font-mono leading-relaxed max-h-96 overflow-y-auto">
                      {JSON.stringify(action, null, 2)}
                    </pre>
                  </div>
                </details>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </div>
    </main>
  );
}
