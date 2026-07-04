"use client";

import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2, Sparkles, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { FeedItem } from "@/lib/campaigns";
import { resolveCluster } from "@/lib/explorer";
import { fadeInUp } from "@/lib/design-system/animations";

type FeedItemComponentProps = {
  item: FeedItem;
  index?: number;
  onLike?: (itemId: string) => void | Promise<void>;
};

const TYPE_STYLES: Record<string, { label: string; bg: string; text: string }> = {
  donation: { label: "Donation", bg: "bg-success-soft", text: "text-success" },
  update: { label: "Update", bg: "bg-accent-soft", text: "text-accent" },
  milestone: { label: "Milestone", bg: "bg-primary-soft", text: "text-primary" },
  cnft: { label: "cNFT Proof", bg: "bg-purple-950/30", text: "text-purple-300" },
};

const TYPE_COLORS: Record<string, string> = {
  donation: "bg-success",
  update: "bg-accent",
  milestone: "bg-primary",
  cnft: "bg-gradient-to-b from-purple-500 to-violet-400",
};

function formatTime(timestamp: number) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function truncateWallet(address: string) {
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-6)}`;
}

export default function FeedItemComponent({ item, index = 0, onLike }: FeedItemComponentProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(item.likes);

  const typeStyle = TYPE_STYLES[item.type] ?? TYPE_STYLES.update;

  const handleLike = async () => {
    if (liked) return;
    setLiked(true);
    setLikeCount((c) => c + 1);
    try {
      await fetch("/api/feed/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: item.id }),
      });
      await onLike?.(item.id);
    } catch {
      setLiked(false);
      setLikeCount((c) => c - 1);
    }
  };

  return (
    <motion.article
      variants={fadeInUp}
      className="group bg-gradient-to-br from-primary/[0.04] via-transparent to-accent/[0.02] backdrop-blur-2xl border border-white/10 rounded-2xl hover:shadow-[0_0_30px_rgba(127,191,127,0.1)] transition-all duration-300 overflow-hidden"
    >
      <div className="relative p-4 flex items-center gap-3 overflow-hidden">
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${TYPE_COLORS[item.type] ?? "bg-accent"}`} />

        <div className={`relative w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 bg-gradient-to-br from-primary to-accent`}>
          {item.type === "cnft" ? <Sparkles size={18} /> : item.campaignTitle[0]}
        </div>

        <div className="flex-1 min-w-0">
          <Link
            href={`/campaign/${item.campaignId}`}
            className="font-bold text-sm text-fg hover:text-primary truncate block transition-colors"
          >
            {item.campaignTitle}
          </Link>
          <p className="text-xs text-fg-muted">{formatTime(item.timestamp)}</p>
        </div>

        <span className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${typeStyle.bg} ${typeStyle.text}`}>
          {typeStyle.label}
        </span>
      </div>

      <div className="px-4 pb-3 space-y-3">
        {item.type === "donation" && (
          <div className="bg-success-soft rounded-xl p-4">
            <p className="text-sm text-fg">
              <span className="font-bold text-success">
                {truncateWallet(item.donor || "")}
              </span>{" "}
              donated{" "}
              <span className="font-bold text-success text-lg">
                {(item.donationAmount || 0).toFixed(2)} SOL
              </span>
            </p>
            <p className="text-xs text-fg-muted mt-1 italic">
              Every contribution brings us closer to the goal.
            </p>
          </div>
        )}

        {item.type === "update" && (
          <div className="space-y-3">
            {item.image && (
              <div className="relative overflow-hidden rounded-xl">
                <img
                  src={item.image}
                  alt="Impact update"
                  loading="lazy"
                  className="w-full rounded-xl object-cover max-h-64 transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
            )}
            {item.content && (
              <p className="text-sm text-fg leading-relaxed bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-xl p-3">
                {item.content}
              </p>
            )}
          </div>
        )}

        {item.type === "milestone" && (
          <div className="bg-primary-soft rounded-xl p-4 border border-primary/20">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-1">
                  Milestone Reached
            </p>
            <p className="text-sm font-bold text-fg">
              {item.milestone || item.content || "A new milestone has been reached!"}
            </p>
          </div>
        )}

        {item.type === "cnft" && (
          <div className="bg-purple-950/20 backdrop-blur-xl rounded-xl p-4 border border-purple-800/40">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-400 flex items-center justify-center text-white shadow-lg shrink-0">
                <Sparkles size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold uppercase tracking-wide text-purple-300 mb-1">
                  Compressed NFT Minted
                </p>
                <p className="text-sm font-semibold text-fg">Impact verified on-chain</p>
                {item.content && <p className="text-xs text-fg-muted mt-1">{item.content}</p>}
                {item.cNFTMintId && (
                  <a
                    href={`https://explorer.solana.com/address/${item.cNFTMintId}?cluster=${resolveCluster()}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 mt-2 text-xs font-mono text-purple-300 bg-purple-900/40 border border-purple-700/50 rounded-lg px-2.5 py-1.5 hover:bg-purple-800/50 transition-colors"
                  >
                    {truncateWallet(item.cNFTMintId)}
                    <ExternalLink size={10} />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between text-fg-muted">
        <button
          onClick={() => void handleLike()}
          disabled={liked}
          className={`flex items-center gap-1.5 text-xs font-semibold transition-all duration-200 ${
            liked ? "text-red-500" : "hover:text-red-500"
          }`}
        >
          <Heart size={15} className={`transition-all duration-200 ${liked ? "fill-red-500 scale-110" : ""}`} />
          {likeCount}
        </button>

        <button className="flex items-center gap-1.5 text-xs font-semibold hover:text-accent transition-colors">
          <MessageCircle size={15} />
          {item.comments}
        </button>

        <button className="flex items-center gap-1.5 text-xs font-semibold hover:text-accent transition-colors">
          <Share2 size={15} />
          Share
        </button>
      </div>
    </motion.article>
  );
}
