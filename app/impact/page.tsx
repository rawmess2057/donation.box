"use client";

import { useEffect, useState } from "react";
import { Flame, TrendingUp, Gift } from "lucide-react";
import FeedItemComponent from "@/components/impact/FeedItemComponent";
import type { FeedItem } from "@/lib/campaigns";

type SortOption = "latest" | "trending" | "topDonations";

export default function ImpactFeedPage() {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadFeed() {
      const response = await fetch(`/api/feed?sortBy=${sortBy}`, { cache: "no-store" });
      const payload = (await response.json()) as { items?: FeedItem[] };

      if (active) {
        setFeedItems(payload.items ?? []);
        setIsLoading(false);
      }
    }

    void loadFeed();
    const interval = setInterval(() => {
      void loadFeed();
    }, 10000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [sortBy]);

  const handleLike = async () => {
    const response = await fetch(`/api/feed?sortBy=${sortBy}`, { cache: "no-store" });
    const payload = (await response.json()) as { items?: FeedItem[] };
    setFeedItems(payload.items ?? []);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#FFF9F0] via-[#FFF5E6] to-[#FFF9F0]">
      <div className=" bg-[#fcf9f1]/80 border-b border-stone-200 sticky top-3 z-40">
        <div className="max-w-4xl mx-auto px-4 py-2">
          <h1 className="text-3xl font-bold text-[#1C1C17] mb-1">
            Live Impact Feed
          </h1>
          <p className="text-sm text-stone-600">
            Real-time updates from campaigns making a difference
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            <button
              onClick={() => setSortBy("latest")}
              className={`px-3 py-1 text-sm rounded-full font-semibold transition ${
                sortBy === "latest"
                  ? "bg-[#97422F] text-white"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200"
              }`}
            >
              Latest
            </button>
            <button
              onClick={() => setSortBy("trending")}
              className={`px-3 py-1 text-sm rounded-full font-semibold flex items-center gap-2 transition ${
                sortBy === "trending"
                  ? "bg-[#97422F] text-white"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200"
              }`}
            >
              <Flame size={14} />
              Trending
            </button>
            <button
              onClick={() => setSortBy("topDonations")}
              className={`px-3 py-1 text-sm rounded-full font-semibold flex items-center gap-2 transition ${
                sortBy === "topDonations"
                  ? "bg-[#97422F] text-white"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200"
              }`}
            >
              <Gift size={14} />
              Top Donations
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">
              <div className="w-12 h-12 border-4 border-stone-200 border-t-[#97422F] rounded-full" />
            </div>
            <p className="text-stone-600 mt-4">Loading impact feed...</p>
          </div>
        ) : feedItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp size={32} className="text-stone-400" />
            </div>
            <h2 className="text-2xl font-bold text-stone-900 mb-2">
              No updates yet
            </h2>
            <p className="text-stone-600 max-w-md mx-auto">
              Be the first to create a campaign and share your impact with the
              world!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {feedItems.map((item) => (
              <FeedItemComponent key={item.id} item={item} onLike={handleLike} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
