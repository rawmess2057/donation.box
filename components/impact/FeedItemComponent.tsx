"use client";

import { Heart, MessageCircle, Share2, Sparkles, ImageIcon, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { FeedItem } from "@/lib/campaigns";
import { resolveCluster } from "@/lib/explorer";

type FeedItemComponentProps = {
  item: FeedItem;
  index?: number;
  onLike?: (itemId: string) => void | Promise<void>;
};

const TYPE_STYLES: Record<string, { label: string; bg: string; text: string; icon: string }> = {
  donation: { label: "Donation", bg: "bg-emerald-100", text: "text-emerald-700", icon: "🎁" },
  update: { label: "Update", bg: "bg-blue-100", text: "text-blue-700", icon: "📸" },
  milestone: { label: "Milestone", bg: "bg-amber-100", text: "text-amber-700", icon: "🏆" },
  cnft: { label: "cNFT Proof", bg: "bg-purple-100", text: "text-purple-700", icon: "🪪" },
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

  const staggerDelay = `${Math.min(index * 0.06, 0.3)}s`;
  const animClass = index < 3
    ? [`animate-card-in`, `animate-card-in-1`, `animate-card-in-2`][index]
    : "animate-card-in";

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
    <article
      className={`group bg-white rounded-2xl shadow-sm border border-stone-200 hover:shadow-lg hover:border-stone-300 transition-all duration-300 ${animClass}`}
      style={{ animationDelay: index >= 3 ? staggerDelay : undefined }}
    >
      {/* Header */}
      <div className="relative p-4 flex items-center gap-3 overflow-hidden">
        {/* Type accent bar */}
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${item.type === "cnft" ? "bg-gradient-to-b from-purple-500 to-violet-400" : item.type === "donation" ? "bg-emerald-400" : item.type === "milestone" ? "bg-amber-400" : "bg-blue-400"}`} />

        {/* Avatar */}
        <div
          className={`relative w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${
            item.type === "cnft"
              ? "bg-gradient-to-br from-purple-600 to-violet-500"
              : item.type === "donation"
                ? "bg-gradient-to-br from-emerald-600 to-teal-500"
                : item.type === "milestone"
                  ? "bg-gradient-to-br from-amber-600 to-orange-500"
                  : "bg-gradient-to-br from-blue-600 to-cyan-500"
          }`}
        >
          {item.type === "cnft" ? (
            <Sparkles size={18} />
          ) : (
            item.campaignTitle[0]
          )}
        </div>

        {/* Campaign info */}
        <div className="flex-1 min-w-0">
          <Link
            href={`/campaign/${item.campaignId}`}
            className="font-bold text-sm text-stone-900 hover:text-[#97422F] truncate block transition-colors"
          >
            {item.campaignTitle}
          </Link>
          <p className="text-xs text-stone-500">{formatTime(item.timestamp)}</p>
        </div>

        {/* Type badge */}
        <span className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${typeStyle.bg} ${typeStyle.text}`}>
          {typeStyle.icon} {typeStyle.label}
        </span>
      </div>

      {/* Body */}
      <div className="px-4 pb-3 space-y-3">
        {/* Donation */}
        {item.type === "donation" && (
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4">
            <p className="text-sm text-stone-700">
              <span className="font-bold text-emerald-700">
                {truncateWallet(item.donor || "")}
              </span>{" "}
              donated{" "}
              <span className="font-bold text-emerald-700 text-lg">
                {(item.donationAmount || 0).toFixed(2)} SOL
              </span>
            </p>
            <p className="text-xs text-stone-500 mt-1 italic">
              Every contribution brings us closer to the goal.
            </p>
          </div>
        )}

        {/* Update */}
        {item.type === "update" && (
          <div className="space-y-3">
            {item.image && (
              <div className="relative overflow-hidden rounded-xl">
                <img
                  src={item.image}
                  alt="Impact update"
                  className="w-full rounded-xl object-cover max-h-64 transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
            )}
            {item.content && (
              <p className="text-sm text-stone-700 leading-relaxed bg-blue-50/50 rounded-xl p-3">
                {item.content}
              </p>
            )}
          </div>
        )}

        {/* Milestone */}
        {item.type === "milestone" && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200/50">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-600 mb-1">
              🏆 Milestone Reached
            </p>
            <p className="text-sm font-bold text-stone-900">
              {item.milestone || item.content || "A new milestone has been reached!"}
            </p>
          </div>
        )}

        {/* cNFT */}
        {item.type === "cnft" && (
          <div className="bg-gradient-to-br from-purple-50 via-violet-50 to-purple-50 rounded-xl p-4 border border-purple-200/50">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-400 flex items-center justify-center text-white shadow-lg shadow-purple-200/50 shrink-0">
                <Sparkles size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold uppercase tracking-wide text-purple-700 mb-1">
                  🪪 Compressed NFT Minted
                </p>
                <p className="text-sm font-semibold text-stone-900">
                  Impact verified on-chain
                </p>
                {item.content && (
                  <p className="text-xs text-stone-600 mt-1">{item.content}</p>
                )}
                {item.cNFTMintId && (
                  <a
                    href={`https://explorer.solana.com/address/${item.cNFTMintId}?cluster=${resolveCluster()}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 mt-2 text-xs font-mono text-purple-600 bg-purple-100 rounded-lg px-2.5 py-1.5 hover:bg-purple-200 transition-colors"
                  >
                    <ImageIcon size={12} />
                    {truncateWallet(item.cNFTMintId)}
                    <ExternalLink size={10} />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div className="px-4 py-3 border-t border-stone-100 flex items-center justify-between text-stone-500">
        <button
          onClick={() => void handleLike()}
          disabled={liked}
          className={`flex items-center gap-1.5 text-xs font-semibold transition-all duration-200 ${
            liked ? "text-red-500" : "hover:text-red-500"
          }`}
        >
          <Heart
            size={15}
            className={`transition-all duration-200 ${liked ? "fill-red-500 scale-110" : ""}`}
          />
          {likeCount}
        </button>

        <button className="flex items-center gap-1.5 text-xs font-semibold hover:text-blue-500 transition-colors">
          <MessageCircle size={15} />
          {item.comments}
        </button>

        <button className="flex items-center gap-1.5 text-xs font-semibold hover:text-green-500 transition-colors">
          <Share2 size={15} />
          Share
        </button>
      </div>
    </article>
  );
}
