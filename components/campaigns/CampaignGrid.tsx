"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Campaign } from "./types";
import CampaignCard from "./CampaignCard";
import { staggerChildren } from "@/lib/design-system/animations";

type Props = {
  title?: string;
  campaigns: Campaign[];
  children?: React.ReactNode;
  showAll?: boolean;
};

const INITIAL_COUNT = 6;

export default function CampaignGrid({ title = "Campaigns", campaigns, children, showAll = false }: Props) {
  const [showCount, setShowCount] = useState(showAll ? INITIAL_COUNT : campaigns.length);
  const visible = campaigns.slice(0, showCount);
  const hasMore = showCount < campaigns.length;

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-3xl font-bold text-fg font-[family-name:var(--font-heading)]">{title}</h2>
          {children}
        </div>

        <motion.div
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
        >
          {visible.map((campaign, i) => (
            <motion.div
              key={campaign.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="break-inside-avoid"
            >
              <CampaignCard campaign={campaign} index={i} />
            </motion.div>
          ))}
        </motion.div>

        {hasMore && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() => setShowCount((prev) => Math.min(prev + INITIAL_COUNT, campaigns.length))}
              className="px-8 py-3 bg-white/[0.04] backdrop-blur-2xl border border-white/10 text-fg-muted font-semibold rounded-xl hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-500 ease-out"
            >
              Load More ({campaigns.length - showCount} remaining)
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
