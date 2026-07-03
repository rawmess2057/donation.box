"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import CampaignGrid from "@/components/campaigns/CampaignGrid";
import ProjectDiscoveryFeed from "@/components/campaigns/ProjectDiscoveryFeed";
import type { Campaign } from "@/components/campaigns/types";
import { getNetworkLabel } from "@/lib/explorer";
import { staggerChildren, fadeInUp } from "@/lib/design-system/animations";

const CATEGORY_EMOJI: Record<string, string> = {
  Education: "📚",
  Emergency: "🆘",
  Nutrition: "🍲",
  Health: "🏥",
  Environment: "🌳",
};

export default function ExplorePage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadCampaigns() {
      try {
        const response = await fetch("/api/campaigns", { cache: "no-store" });
        const payload = (await response.json()) as { campaigns?: Campaign[] };

        if (active) {
          setCampaigns(payload.campaigns ?? []);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void loadCampaigns();

    return () => {
      active = false;
    };
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(campaigns.map((item) => item.category))),
    [campaigns],
  );

  const filtered = activeCategory
    ? campaigns.filter((c) => c.category === activeCategory)
    : campaigns;

  return (
    <main className="min-h-screen bg-bg">
      <div className="max-w-7xl mx-auto px-4 pt-10 pb-10">
        <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="mb-2">
          <h1 className="text-4xl md:text-5xl font-bold text-fg font-[family-name:var(--font-heading)]">
            Explore Campaigns
          </h1>
          <p className="mt-2 text-sm text-fg-muted max-w-xl">
            Discover campaigns making a real impact on Solana {getNetworkLabel()}.
          </p>
        </motion.div>

        <motion.div
          variants={staggerChildren}
          initial="hidden"
          animate="visible"
          className="mt-6 flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-none"
        >
          <button
            onClick={() => setActiveCategory(null)}
            className={`snap-start shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition-all duration-200 ${
              !activeCategory
                ? "bg-primary/20 backdrop-blur-xl border border-primary/40 text-primary shadow-[0_0_10px_rgba(127,191,127,0.15)]"
                : "bg-white/5 backdrop-blur-xl border border-white/10 text-fg-muted hover:text-fg"
            }`}
          >
            All
          </button>
          {categories.map((category, i) => (
            <motion.button
              key={category}
              variants={fadeInUp}
              onClick={() => setActiveCategory(category)}
              className={`snap-start shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition-all duration-200 ${
                activeCategory === category
                  ? "bg-primary/20 backdrop-blur-xl border border-primary/40 text-primary shadow-[0_0_10px_rgba(127,191,127,0.15)]"
                  : "bg-white/5 backdrop-blur-xl border border-white/10 text-fg-muted hover:text-fg"
              }`}
            >
              {CATEGORY_EMOJI[category] ?? ""} {category}
            </motion.button>
          ))}
        </motion.div>

        {isLoading ? (
          <div className="py-20 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full glass-surface mb-4">
              <div className="w-6 h-6 border-[3px] border-border border-t-primary rounded-full animate-spin" />
            </div>
            <p className="text-fg-muted text-sm">Loading campaigns...</p>
          </div>
        ) : (
          <>
            {campaigns.length > 0 && (
              <ProjectDiscoveryFeed
                campaigns={filtered}
                title=""
                description=""
                className="mt-8"
              />
            )}

            <CampaignGrid
              title={activeCategory ? `${activeCategory}` : "All Campaigns"}
              campaigns={filtered}
              showAll
            />

            {filtered.length === 0 && (
              <div className="text-center py-20">
                <p className="text-fg-muted">No campaigns found in this category.</p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
