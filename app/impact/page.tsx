"use client";

import { useEffect, useState } from "react";
import { Flame, TrendingUp, Gift, Sparkles, Activity } from "lucide-react";
import FeedItemComponent from "@/components/impact/FeedItemComponent";
import type { FeedItem } from "@/lib/campaigns";

type SortOption = "latest" | "trending" | "topDonations";

const SORT_BUTTONS: { key: SortOption; label: string; icon: typeof Flame }[] = [
  { key: "latest", label: "Latest", icon: Activity },
  { key: "trending", label: "Trending", icon: Flame },
  { key: "topDonations", label: "Top Donations", icon: Gift },
];

export default function ImpactFeedPage() {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadFeed() {
      try {
        const response = await fetch(`/api/feed?sortBy=${sortBy}`, { cache: "no-store" });
        const payload = (await response.json()) as { items?: FeedItem[] };

        if (active) {
          setFeedItems(payload.items ?? []);
          setIsLoading(false);
        }
      } catch {
        if (active) setIsLoading(false);
      }
    }

    void loadFeed();
    const interval = setInterval(() => void loadFeed(), 10000);

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

  // Stats
  const totalDonations = feedItems.filter((i) => i.type === "donation").length;
  const totalUpdates = feedItems.filter((i) => i.type === "update").length;
  const totalSolfunded = feedItems
    .filter((i) => i.type === "donation")
    .reduce((sum, i) => sum + (i.donationAmount || 0), 0);

  return (
    <main className="min-h-screen bg-[#FFF9F0]">
      {/* Header */}
      <div className="bg-white border-b border-stone-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 pt-24 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={20} className="text-[#97422F]" />
            <h1 className="text-2xl md:text-3xl font-bold text-stone-900">
              Live Impact Feed
            </h1>
          </div>
          <p className="text-sm text-stone-500">
            Real-time updates, donations, and milestones from campaigns making a difference
          </p>

          {/* Stats row */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="bg-emerald-50 rounded-xl px-3 py-2.5 text-center">
              <p className="text-lg font-bold text-emerald-700">{totalDonations}</p>
              <p className="text-[10px] uppercase tracking-wider text-emerald-600 font-semibold">
                Donations
              </p>
            </div>
            <div className="bg-blue-50 rounded-xl px-3 py-2.5 text-center">
              <p className="text-lg font-bold text-blue-700">{totalUpdates}</p>
              <p className="text-[10px] uppercase tracking-wider text-blue-600 font-semibold">
                Updates
              </p>
            </div>
            <div className="bg-amber-50 rounded-xl px-3 py-2.5 text-center">
              <p className="text-lg font-bold text-amber-700">
                {totalSolfunded.toFixed(1)} SOL
              </p>
              <p className="text-[10px] uppercase tracking-wider text-amber-600 font-semibold">
                Donated
              </p>
            </div>
          </div>

          {/* Sort tabs */}
          <div className="mt-4 flex gap-2">
            {SORT_BUTTONS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setSortBy(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full font-semibold transition-all duration-200 ${
                  sortBy === key
                    ? "bg-[#97422F] text-white shadow-md shadow-orange-200/50"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Feed content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-stone-100 mb-4">
              <div className="w-6 h-6 border-[3px] border-stone-200 border-t-[#97422F] rounded-full animate-spin" />
            </div>
            <p className="text-stone-600 text-sm font-medium">Loading impact feed...</p>
          </div>
        ) : feedItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp size={28} className="text-stone-400" />
            </div>
            <h2 className="text-xl font-bold text-stone-900 mb-1">No updates yet</h2>
            <p className="text-sm text-stone-500 max-w-sm mx-auto">
              Be the first to create a campaign and share your impact with the world!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {feedItems.map((item, i) => (
              <FeedItemComponent key={item.id} item={item} index={i} onLike={handleLike} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
