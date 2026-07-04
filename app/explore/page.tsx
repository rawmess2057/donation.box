"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, type Variants } from "framer-motion";
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

const subtitleItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 100, damping: 14, delay: 0.15 },
  },
};

const pillVariants: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 120, damping: 13 },
  },
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
        if ( active) {
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
    <main className="min-h-screen bg-bg relative overflow-hidden">
      {/* Solana background shapes */}
      <motion.div
        className="absolute top-[5%] right-[2%] w-[200px] h-[200px] pointer-events-none z-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(127,191,127,0.1), rgba(127,191,127,0.03))",
          clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
        }}
        animate={{ x: [0, -15, 10, 0], y: [0, 12, -8, 0], rotate: [0, 5, -3, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[10%] left-[1%] w-[180px] h-[150px] pointer-events-none z-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(3,225,255,0.07), rgba(3,225,255,0.02))",
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
        }}
        animate={{ x: [0, 12, -6, 0], y: [0, -10, 8, 0], rotate: [0, -3, 2, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
      <motion.div
        className="absolute top-[40%] left-[5%] w-[160px] h-[35px] pointer-events-none z-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(220,31,255,0.06), rgba(220,31,255,0.02))",
          clipPath: "polygon(0% 0%, 70% 0%, 100% 100%, 30% 100%)",
        }}
        animate={{ x: [0, 18, -8, 0], scale: [1, 1.06, 0.96, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />

      <div className="relative max-w-7xl mx-auto px-4 pt-10 pb-10 z-[2]">
        {/* Heading */}
        <motion.div
          variants={headingVariants}
          initial="hidden"
          animate="visible"
          className="mb-2"
        >
          <motion.h1
            variants={headingItem}
            className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-heading)]"
          >
            <span
              className="bg-gradient-to-r from-primary via-accent to-success bg-clip-text text-transparent animate-shimmer"
              style={{ backgroundSize: "200% 100%" }}
            >
              Explore
            </span>{" "}
            <span className="text-fg">Campaigns</span>
          </motion.h1>
          <motion.p
            variants={subtitleItem}
            className="mt-2 text-sm text-fg-muted max-w-xl"
          >
            Discover campaigns making a real impact on Solana {getNetworkLabel()}.
          </motion.p>
        </motion.div>

        {/* Category filters */}
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          animate="visible"
          className="mt-6 flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-none"
        >
          <motion.button
            variants={pillVariants}
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveCategory(null)}
            className={`snap-start shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition-all duration-300 ${
              !activeCategory
                ? "bg-primary/20 backdrop-blur-xl border border-primary/40 text-primary shadow-[0_0_15px_rgba(127,191,127,0.2)]"
                : "bg-white/5 backdrop-blur-xl border border-white/10 text-fg-muted hover:text-fg"
            }`}
          >
            All
          </motion.button>
          {categories.map((category, i) => (
            <motion.button
              key={category}
              variants={pillVariants}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(category)}
              className={`snap-start shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition-all duration-300 ${
                activeCategory === category
                  ? "bg-primary/20 backdrop-blur-xl border border-primary/40 text-primary shadow-[0_0_15px_rgba(127,191,127,0.2)]"
                  : "bg-white/5 backdrop-blur-xl border border-white/10 text-fg-muted hover:text-fg"
              }`}
            >
              {CATEGORY_EMOJI[category] ?? ""} {category}
            </motion.button>
          ))}
        </motion.div>

        {isLoading ? (
          <div className="py-20 text-center relative">
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[180px] pointer-events-none"
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
                campaigns
              </span>
              ...
            </p>
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
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring" as const, stiffness: 100, damping: 14 }}
                className="text-center py-20"
              >
                <div className="inline-block bg-gradient-to-br from-primary/[0.06] via-transparent to-accent/[0.04] backdrop-blur-2xl border border-white/10 rounded-2xl p-8 max-w-sm mx-auto">
                  <p className="text-fg-muted">
                    No campaigns found in{" "}
                    <span className="text-primary font-semibold">{activeCategory}</span>.
                  </p>
                  <button
                    onClick={() => setActiveCategory(null)}
                    className="mt-4 text-sm font-semibold text-accent hover:text-accent-hover transition-colors duration-300"
                  >
                    View all campaigns &rarr;
                  </button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
