"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Campaign } from "./types";
import { getCategoryColor } from "@/lib/categories";
import Link from "next/link";

type Props = { campaign: Campaign; index?: number };

export default function CampaignCard({ campaign, index = 0 }: Props) {
  const progress = Math.min(100, campaign.progress);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group relative rounded-2xl bg-gradient-to-br from-primary/[0.04] via-transparent to-accent/[0.02] backdrop-blur-2xl border border-white/10 shadow-[0_0_15px_rgba(127,191,127,0.06)] hover:shadow-[0_0_30px_rgba(127,191,127,0.15)] transition-all duration-500 ease-out"
    >
      <Link href={`/campaign/${campaign.id}`} className="block">
        <div className="relative h-48 overflow-hidden rounded-t-2xl">
          <Image
            src={campaign.image}
            alt={campaign.title}
            width={420}
            height={230}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 420px"
          />

          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-0 glass-overlay" />
            <div className="absolute inset-0" style={{ filter: "url(#glass-medium)" }} />
          </div>

          <span
            className={`absolute top-3 left-3 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider shadow-sm ${getCategoryColor(campaign.category)}`}
          >
            {campaign.category}
          </span>

          {campaign.donations.length > 0 && (
            <span className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
              {campaign.donations.length} donor{campaign.donations.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        <div className="p-5 space-y-3">
          <h3 className="text-lg font-bold leading-snug text-fg line-clamp-2 font-[family-name:var(--font-heading)]">
            {campaign.title}
          </h3>

          {campaign.subtitle && (
            <p className="text-sm text-fg-muted leading-relaxed line-clamp-2">
              {campaign.subtitle}
            </p>
          )}

          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xl font-bold text-fg tabular-nums">
                {campaign.raised.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })}
              </span>
              <span className="text-sm text-fg-muted ml-1">SOL raised</span>
            </div>
          </div>

          <div className="relative h-2.5 bg-bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-success animate-river-flow"
              initial={{ width: 0 }}
              whileInView={{ width: `${progress}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              role="progressbar"
              aria-valuenow={campaign.raised}
              aria-valuemin={0}
              aria-valuemax={campaign.goal}
            />
          </div>

          <div className="flex justify-between text-xs text-fg-subtle">
            <span>Goal: {campaign.goal.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })} SOL</span>
            <span className="font-semibold text-fg-muted">{campaign.progress}%</span>
          </div>

          <div className="block w-full text-center bg-white/[0.04] backdrop-blur-2xl border border-white/20 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-all duration-500 ease-out shadow-[0_0_15px_rgba(127,191,127,0.15)] hover:shadow-[0_0_40px_rgba(127,191,127,0.3)] hover:border-primary/50 hover:bg-primary/15 active:scale-[0.98]">
            Donate Now
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
