"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Campaign } from "./types";

interface ProjectDiscoveryFeedProps {
  campaigns: Campaign[];
  title?: string;
  description?: string;
  className?: string;
}

export default function ProjectDiscoveryFeed({
  campaigns,
  title = "Discover Projects",
  description = "Trending campaigns making an impact right now",
  className = "",
}: ProjectDiscoveryFeedProps) {
  const sorted = useMemo(() => {
    return [...campaigns].sort((a, b) => {
      const aScore = a.donations.length * a.raised;
      const bScore = b.donations.length * b.raised;
      return bScore - aScore;
    });
  }, [campaigns]);

  if (campaigns.length === 0) return null;

  return (
    <section className={className}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-fg font-[family-name:var(--font-heading)]">
            {title}
          </h2>
          <p className="text-sm text-fg-muted mt-1">{description}</p>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none -mx-6 px-6">
          {sorted.slice(0, 8).map((campaign, i) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="snap-start shrink-0"
            >
              <Link
                href={`/campaign/${campaign.id}`}
                className="group block w-56 rounded-2xl bg-bg-card border border-border overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300"
              >
                <div className="relative h-28 overflow-hidden">
                  <Image
                    src={campaign.image}
                    alt={campaign.title}
                    width={224}
                    height={112}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <span className="absolute bottom-2 left-2 text-white text-[10px] font-semibold bg-black/50 rounded-full px-2 py-0.5">
                    {campaign.category}
                  </span>
                </div>
                <div className="p-3 space-y-1.5">
                  <h3 className="text-sm font-bold text-fg leading-snug line-clamp-1">
                    {campaign.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-primary tabular-nums">
                      {campaign.raised.toFixed(1)} SOL
                    </span>
                    <span className="text-fg-subtle">{campaign.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                      style={{ width: `${Math.min(100, campaign.progress)}%` }}
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
