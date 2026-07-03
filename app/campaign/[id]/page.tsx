"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import CampaignDonateClient from "@/components/campaigns/CampaignDonateClient";
import ShareButton from "@/components/campaigns/ShareButton";
import ImpactCalculator from "@/components/campaigns/ImpactCalculator";
import RealTimeProgressVisualizer from "@/components/campaigns/RealTimeProgressVisualizer";
import { getExplorerTxUrl } from "@/lib/explorer";
import type { CampaignRecord } from "@/lib/campaigns";
import { fadeInUp } from "@/lib/design-system/animations";

export default function CampaignDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [campaign, setCampaign] = useState<CampaignRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadCampaign() {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/campaigns/${id}`, { cache: "no-store" });
        if (!response.ok) {
          if (active) setCampaign(null);
          return;
        }

        const payload = (await response.json()) as { campaign?: CampaignRecord };
        if (active) {
          setCampaign(payload.campaign ?? null);
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void loadCampaign();

    return () => {
      active = false;
    };
  }, [id]);

  return (
    <main className="min-h-screen bg-bg relative overflow-hidden">
      {/* Solana background shapes */}
      <motion.div
        className="absolute top-[8%] right-[1%] w-[200px] h-[200px] pointer-events-none z-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(127,191,127,0.1), rgba(127,191,127,0.03))",
          clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
        }}
        animate={{ x: [0, -15, 10, 0], y: [0, 12, -8, 0], rotate: [0, 5, -3, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[15%] left-[1%] w-[180px] h-[150px] pointer-events-none z-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(3,225,255,0.07), rgba(220,31,255,0.03))",
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
        }}
        animate={{ x: [0, 14, -8, 0], y: [0, -10, 6, 0], rotate: [0, -3, 2, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />

      {isLoading ? (
        <div className="relative max-w-6xl mx-auto px-4 pt-10 py-10 z-[2]">
          <div className="py-20 text-center relative">
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] h-[160px] pointer-events-none"
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
                campaign
              </span>
              ...
            </p>
          </div>
        </div>
      ) : !campaign ? (
        <div className="relative max-w-6xl mx-auto px-4 pt-10 py-10 z-[2]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring" as const, stiffness: 100, damping: 14 }}
            className="text-center py-20"
          >
            <div className="inline-block bg-gradient-to-br from-primary/[0.06] via-transparent to-accent/[0.04] backdrop-blur-2xl border border-white/10 rounded-2xl p-8 max-w-sm mx-auto">
              <h1 className="text-2xl font-bold text-fg font-[family-name:var(--font-heading)]">
                <span
                  className="bg-gradient-to-r from-primary via-accent to-success bg-clip-text text-transparent"
                >
                  Campaign
                </span>{" "}
                not found
              </h1>
              <p className="mt-2 text-fg-muted text-sm">
                This campaign doesn&apos;t exist or has been removed.
              </p>
              <Link
                href="/explore"
                className="inline-block mt-4 text-sm font-semibold text-accent hover:text-accent-hover transition-colors duration-300"
              >
                Browse campaigns &rarr;
              </Link>
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="relative max-w-6xl mx-auto px-4 pt-6 pb-10 z-[2]">
          <div className="grid gap-8 md:grid-cols-3">
            <article className="md:col-span-2 space-y-6">
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="relative overflow-hidden rounded-2xl border border-white/10"
              >
                <Image
                  src={campaign.image}
                  alt={campaign.title}
                  width={1200}
                  height={700}
                  className="h-[400px] w-full object-cover"
                  preload
                />
                {campaign.verified && (
                  <span className="absolute left-4 bottom-4 rounded-full bg-accent/90 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-white">
                    Verified cause
                  </span>
                )}
              </motion.div>

              {/* Title & subtitle */}
              <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-4">
                <h1 className="text-3xl md:text-4xl font-bold text-fg leading-tight font-[family-name:var(--font-heading)]">
                  {campaign.title}
                </h1>
                <p className="text-lg text-fg-muted">{campaign.subtitle}</p>
              </motion.div>

              {/* The Story */}
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="bg-gradient-to-br from-primary/[0.04] via-transparent to-accent/[0.02] backdrop-blur-2xl border border-white/10 rounded-2xl p-6 space-y-4"
              >
                <h2 className="text-sm font-semibold uppercase tracking-wide text-fg-muted">
                  The Story
                </h2>
                <p className="leading-relaxed text-fg font-[family-name:var(--font-body)]">
                  {campaign.story}
                </p>
              </motion.div>

              <ImpactCalculator impactDescription={campaign.impactDescription} />

              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="rounded-2xl glass-surface p-5 space-y-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full glass px-3 py-1 text-xs font-semibold text-fg-muted">
                    {campaign.category}
                  </span>
                  {!campaign.verified && (
                    <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
                      User Created
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  {campaign.creator && (
                    <div className="col-span-2 md:col-span-1">
                      <span className="text-xs font-semibold uppercase tracking-wide text-fg-subtle">Creator</span>
                      <p className="mt-0.5 font-mono text-xs text-fg-muted break-all">
                        {campaign.creator.slice(0, 4)}...{campaign.creator.slice(-4)}
                      </p>
                    </div>
                  )}
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-fg-subtle">Goal</span>
                    <p className="mt-0.5 text-fg">{campaign.goal.toLocaleString()} SOL</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-fg-subtle">Raised</span>
                    <p className="mt-0.5 text-fg font-semibold">{campaign.raised.toLocaleString()} SOL</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-fg-subtle">Created</span>
                    <p className="mt-0.5 text-fg">
                      {new Date(campaign.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <a
                  href={getExplorerTxUrl(campaign.txSignature)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-hover transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View on Solana Explorer
                </a>
              </motion.div>
            </article>

            <aside className="flex flex-col gap-4 md:sticky md:top-24 md:self-start">
              <div className="flex gap-2">
                <div className="flex-1">
                  <ShareButton campaignId={id} campaignTitle={campaign.title} />
                </div>
              </div>

              <RealTimeProgressVisualizer
                raised={campaign.raised}
                goal={campaign.goal}
                recentDonors={campaign.donations.slice(-5).map((d) => ({
                  address: d.donor,
                  amount: d.amount,
                }))}
              />

              <CampaignDonateClient
                raised={campaign.raised}
                goal={campaign.goal}
                currency={campaign.currency}
                recipientAddress={campaign.creator}
                campaignId={campaign.verified ? undefined : id}
                campaignTitle={campaign.title}
                campaignImage={campaign.image}
                campaignCreator={campaign.creator}
                impactDescription={campaign.impactDescription}
                onDonationSuccess={(amount) => {
                  setCampaign((current) =>
                    current
                      ? { ...current, raised: current.raised + amount }
                      : current,
                  );
                }}
              />
            </aside>
          </div>
        </div>
      )}
    </main>
  );
}
