"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Flame, TrendingUp, Gift, Sparkles } from "lucide-react";
import FeedItemComponent from "@/components/impact/FeedItemComponent";
import DonationMoment from "@/components/impact/DonationMoment";
import type { FeedItem } from "@/lib/campaigns";
import { fadeInUp, staggerChildren } from "@/lib/design-system/animations";

type SortOption = "latest" | "trending" | "topDonations";

const SORT_BUTTONS: { key: SortOption; label: string; icon: typeof Flame }[] = [
  { key: "latest", label: "Latest", icon: Sparkles },
  { key: "trending", label: "Trending", icon: Flame },
  { key: "topDonations", label: "Top Donations", icon: Gift },
];

export default function ImpactFeedPage() {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [isLoading, setIsLoading] = useState(true);
  const [lastDonation, setLastDonation] = useState<{ amount: number; donor: string } | null>(null);

  useEffect(() => {
    let active = true;

    async function loadFeed() {
      try {
        const response = await fetch(`/api/feed?sortBy=${sortBy}`, { cache: "no-store" });
        const payload = (await response.json()) as { items?: FeedItem[] };

        if (active) {
          const items = payload.items ?? [];
          setFeedItems(items);

          const newDonation = items.find(
            (i) => i.type === "donation" && i.donor && i.donationAmount
          );
          if (newDonation) {
            setLastDonation({
              amount: newDonation.donationAmount!,
              donor: newDonation.donor!.slice(0, 6),
            });
            setTimeout(() => setLastDonation(null), 3000);
          }

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

  const totalDonations = feedItems.filter((i) => i.type === "donation").length;
  const totalUpdates = feedItems.filter((i) => i.type === "update").length;
  const totalSolfunded = feedItems
    .filter((i) => i.type === "donation")
    .reduce((sum, i) => sum + (i.donationAmount || 0), 0);

  return (
    <main className="min-h-screen bg-bg">
      <div className="glass-surface border-b border-white/10 dark:border-white/5">
        <div className="max-w-4xl mx-auto px-4 pt-6 pb-4">
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="flex items-center gap-2 mb-1">
            <Sparkles size={20} className="text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold text-fg font-[family-name:var(--font-heading)]">
              Live Impact Feed
            </h1>
          </motion.div>
          <p className="text-sm text-fg-muted">
            Real-time updates, donations, and milestones from campaigns making a difference
          </p>

          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { value: totalDonations, label: "Donations", color: "text-success", bg: "bg-success-soft" },
              { value: totalUpdates, label: "Updates", color: "text-accent", bg: "bg-accent-soft" },
              { value: `${totalSolfunded.toFixed(1)} SOL`, label: "Donated", color: "text-primary", bg: "bg-primary-soft" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className={`glass-surface rounded-xl px-3 py-2.5 text-center`}
              >
                <p className={`text-lg font-bold ${stat.color} tabular-nums`}>{stat.value}</p>
                <p className="text-[10px] uppercase tracking-wider text-fg-muted font-semibold">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            {SORT_BUTTONS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setSortBy(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full font-semibold transition-all duration-200 ${
                  sortBy === key
                    ? "bg-primary/20 backdrop-blur-xl border border-primary/40 text-primary shadow-[0_0_10px_rgba(127,191,127,0.15)]"
                    : "bg-white/5 backdrop-blur-xl border border-white/10 text-fg-muted hover:text-fg"
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 relative">
        {lastDonation && (
          <div className="fixed top-24 right-4 z-40 w-72">
            <DonationMoment
              amount={lastDonation.amount}
              donorName={lastDonation.donor}
              show
            />
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full glass-surface mb-4">
              <div className="w-6 h-6 border-[3px] border-border border-t-primary rounded-full animate-spin" />
            </div>
            <p className="text-fg-muted text-sm font-medium">Loading impact feed...</p>
          </div>
        ) : feedItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 glass-surface rounded-2xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp size={28} className="text-fg-subtle" />
            </div>
            <h2 className="text-xl font-bold text-fg mb-1">No updates yet</h2>
            <p className="text-sm text-fg-muted max-w-sm mx-auto">
              Be the first to create a campaign and share your impact with the world!
            </p>
          </div>
        ) : (
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {feedItems.map((item, i) => (
              <FeedItemComponent key={item.id} item={item} index={i} onLike={handleLike} />
            ))}
          </motion.div>
        )}
      </div>
    </main>
  );
}
