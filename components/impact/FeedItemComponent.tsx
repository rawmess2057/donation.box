"use client";

import { Heart, MessageCircle, Share2 } from "lucide-react";
import Link from "next/link";
import type { FeedItem } from "@/lib/campaigns";

type FeedItemComponentProps = {
  item: FeedItem;
  onLike?: (itemId: string) => void | Promise<void>;
};

export default function FeedItemComponent({
  item,
  onLike,
}: FeedItemComponentProps) {
  const handleLike = async () => {
    await fetch("/api/feed/like", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ itemId: item.id }),
    });
    await onLike?.(item.id);
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const truncateWallet = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-stone-200 hover:shadow-md transition">
      <div className="p-4 border-b border-stone-100 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#97422F] to-[#6B3220] flex items-center justify-center text-white font-bold text-sm">
          {item.campaignTitle[0]}
        </div>
        <div className="flex-1 min-w-0">
          <Link href={`/campaign/${item.campaignId}`}>
            <h3 className="font-bold text-sm text-[#1C1C17] hover:text-[#97422F] truncate">
              {item.campaignTitle}
            </h3>
          </Link>
          <p className="text-xs text-stone-500">{formatTime(item.timestamp)}</p>
        </div>
        {item.type === "donation" && (
          <div className="px-2 py-1 bg-green-100 rounded-full">
            <span className="text-xs font-bold text-green-700">Donation</span>
          </div>
        )}
        {item.type === "update" && (
          <div className="px-2 py-1 bg-blue-100 rounded-full">
            <span className="text-xs font-bold text-blue-700">Update</span>
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        {item.type === "donation" && (
          <div className="space-y-2">
            <p className="text-sm text-stone-700">
              <span className="font-bold text-[#97422F]">
                {truncateWallet(item.donor || "")}
              </span>{" "}
              donated{" "}
              <span className="font-bold text-[#97422F]">
                {(item.donationAmount || 0).toFixed(2)} SOL
              </span>
            </p>
            <p className="text-xs text-stone-500 italic">
              Thank you for making a difference!
            </p>
          </div>
        )}

        {item.type === "update" && (
          <div className="space-y-3">
            {item.image && (
              <img
                src={item.image}
                alt="Impact update"
                className="w-full rounded-lg object-cover max-h-64"
              />
            )}
            {item.video && (
              <div className="bg-stone-100 rounded-lg p-4 text-center">
                <p className="text-xs text-stone-600">Video: {item.video}</p>
              </div>
            )}
            {item.content && (
              <p className="text-sm text-stone-700 leading-relaxed">{item.content}</p>
            )}
          </div>
        )}
      </div>

      <div className="px-4 py-3 border-t border-stone-100 flex items-center justify-between text-stone-600">
        <button
          onClick={() => void handleLike()}
          className="flex items-center gap-2 text-sm hover:text-red-500 transition group"
        >
          <Heart size={16} className="group-hover:fill-red-500 transition" />
          <span className="text-xs">{item.likes}</span>
        </button>

        <button className="flex items-center gap-2 text-sm hover:text-blue-500 transition">
          <MessageCircle size={16} />
          <span className="text-xs">{item.comments}</span>
        </button>

        <button className="flex items-center gap-2 text-sm hover:text-green-500 transition">
          <Share2 size={16} />
          <span className="text-xs">Share</span>
        </button>
      </div>
    </div>
  );
}
