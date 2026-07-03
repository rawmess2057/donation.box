"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Eye, MousePointer2, Share as ShareIcon, Heart, Sparkles, TrendingUp, Gift, Wallet, ArrowRight } from "lucide-react";
import Link from "next/link";
import { truncateAddress } from "@/lib/transactionFetcher";
import PostImpact from "@/components/impact/PostImpact";
import ProgressBar from "@/components/ui/ProgressBar";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import Avatar from "@/components/ui/Avatar";
import { staggerChildren, fadeInUp } from "@/lib/design-system/animations";
import type { CampaignRecord } from "@/lib/campaigns";

const glassCard =
  "bg-gradient-to-br from-primary/[0.04] via-transparent to-accent/[0.02] backdrop-blur-2xl border border-white/10 rounded-2xl";

const CARD_ACCENTS = [
  { shadow: "0 0 30px rgba(127,191,127,0.25)", border: "rgba(127,191,127,0.5)", color: "rgb(127,191,127)" },
  { shadow: "0 0 30px rgba(3,225,255,0.25)", border: "rgba(3,225,255,0.5)", color: "rgb(3,225,255)" },
  { shadow: "0 0 30px rgba(220,31,255,0.25)", border: "rgba(220,31,255,0.5)", color: "rgb(220,31,255)" },
  { shadow: "0 0 30px rgba(239,68,68,0.25)", border: "rgba(239,68,68,0.5)", color: "rgb(239,68,68)" },
  { shadow: "0 0 30px rgba(245,158,11,0.25)", border: "rgba(245,158,11,0.5)", color: "rgb(245,158,11)" },
  { shadow: "0 0 30px rgba(20,184,166,0.25)", border: "rgba(20,184,166,0.5)", color: "rgb(20,184,166)" },
  { shadow: "0 0 30px rgba(59,130,246,0.25)", border: "rgba(59,130,246,0.5)", color: "rgb(59,130,246)" },
  { shadow: "0 0 30px rgba(236,72,153,0.25)", border: "rgba(236,72,153,0.5)", color: "rgb(236,72,153)" },
];

const hoverSpring = { type: "spring" as const, stiffness: 200, damping: 15 };

type CampaignStats = {
  views: number;
  clicks: number;
  shares: number;
  interactions: number;
};

export default function CreatorDashboard({ creatorAddress }: { creatorAddress: string }) {
  const [myCampaigns, setMyCampaigns] = useState<CampaignRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const selectedCampaign = useMemo(
    () => myCampaigns.find((campaign) => campaign.id === selectedCampaignId) ?? myCampaigns[0] ?? null,
    [myCampaigns, selectedCampaignId],
  );

  useEffect(() => {
    let active = true;

    async function loadCampaigns() {
      try {
        const response = await fetch(
          `/api/campaigns?creator=${encodeURIComponent(creatorAddress)}`,
          { cache: "no-store" },
        );
        const payload = (await response.json()) as { campaigns?: CampaignRecord[] };

        if (active) {
          const campaigns = (payload.campaigns ?? []).filter((campaign) => !campaign.verified);
          setMyCampaigns(campaigns);
          setSelectedCampaignId(campaigns[0]?.id ?? null);
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void loadCampaigns();

    return () => {
      active = false;
    };
  }, [creatorAddress]);

  const getCampaignStats = (campaignId: string): CampaignStats => {
    const hash = campaignId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return {
      views: 100 + (hash % 100),
      clicks: 300 + (hash % 200),
      shares: 10 + (hash % 20),
      interactions: 15 + (hash % 20),
    };
  };

  const totalRaised = myCampaigns.reduce((sum, c) => sum + c.raised, 0);
  const totalDonations = myCampaigns.reduce((sum, c) => sum + c.donations.length, 0);
  const totalGoal = myCampaigns.reduce((sum, c) => sum + c.goal, 0);

  const TOP_STATS = [
    { icon: Gift, label: "Total Campaigns", value: myCampaigns.length, accent: 0 },
    { icon: TrendingUp, label: "Total Raised", value: `${totalRaised.toFixed(1)} SOL`, accent: 1 },
    { icon: Heart, label: "Total Donations", value: totalDonations, accent: 2 },
    { icon: Wallet, label: "Progress", value: totalGoal > 0 ? `${Math.round((totalRaised / totalGoal) * 100)}%` : "0%", accent: 3 },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg px-4 py-10">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="h-8 w-48 bg-white/[0.04] backdrop-blur-xl rounded-lg animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 h-64 bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl animate-pulse" />
            <div className="lg:col-span-2 h-96 bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (myCampaigns.length === 0) {
    return (
      <div className="min-h-screen bg-bg px-4 py-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring" as const, stiffness: 100, damping: 14 }}
            className="flex items-center gap-2 mb-6"
          >
            <Sparkles size={22} className="text-primary" />
            <h1 className="text-3xl font-bold text-fg font-[family-name:var(--font-heading)]">My Campaigns</h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring" as const, stiffness: 100, damping: 14, delay: 0.1 }}
            className={glassCard + " p-16 text-center"}
          >
            <div className="w-16 h-16 bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Gift size={28} className="text-fg-subtle" />
            </div>
            <h2 className="text-xl font-bold text-fg mb-2">No campaigns yet</h2>
            <p className="text-fg-muted text-sm max-w-md mx-auto mb-6">
              You haven&apos;t created any campaigns. Start your first one and make an impact!
            </p>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 bg-white/[0.04] backdrop-blur-2xl border border-white/20 text-white font-bold py-3 px-8 rounded-xl transition-all duration-500 ease-out shadow-[0_0_15px_rgba(127,191,127,0.15)] hover:shadow-[0_0_40px_rgba(127,191,127,0.3)] hover:border-primary/50 hover:bg-primary/15"
            >
              Create Your First Campaign
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="flex items-center gap-2 mb-6">
          <Sparkles size={22} className="text-primary" />
          <h1 className="text-3xl font-bold text-fg font-[family-name:var(--font-heading)]">My Campaigns</h1>
        </motion.div>

        <motion.div variants={staggerChildren} initial="hidden" animate="visible" className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {TOP_STATS.map((stat) => {
            const Icon = stat.icon;
            const accent = CARD_ACCENTS[stat.accent];
            return (
              <motion.div
                key={stat.label}
                variants={fadeInUp}
                whileHover={{ y: -3, scale: 1.01, boxShadow: accent.shadow, borderColor: accent.border }}
                transition={hoverSpring}
                className={glassCard + " px-4 py-3.5 cursor-default"}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon size={14} style={{ color: accent.color }} />
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-fg-muted">{stat.label}</p>
                </div>
                <p className="text-2xl font-bold text-fg tabular-nums" style={{ transition: "color 0.3s" }}>
                  {stat.value}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-fg-muted mb-3 px-1">
              Select a campaign
            </p>
            {myCampaigns.map((campaign, i) => {
              const cardAccent = CARD_ACCENTS[i % CARD_ACCENTS.length];
              const isSelected = selectedCampaign?.id === campaign.id;
              return (
                <button
                  key={campaign.id}
                  onClick={() => setSelectedCampaignId(campaign.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all duration-300 group ${
                    isSelected
                      ? "bg-primary/20 backdrop-blur-xl border border-primary/40 text-primary shadow-[0_0_10px_rgba(127,191,127,0.15)]"
                      : "bg-white/[0.04] backdrop-blur-xl border border-white/10 text-fg"
                  }`}
                  style={!isSelected ? {
                    transition: "all 0.3s",
                  } : undefined}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      const el = e.currentTarget;
                      el.style.boxShadow = cardAccent.shadow;
                      el.style.borderColor = cardAccent.border;
                      el.style.backgroundColor = `rgba(${cardAccent.color.slice(4, -1)}, 0.1)`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      const el = e.currentTarget;
                      el.style.boxShadow = "none";
                      el.style.borderColor = "rgba(255,255,255,0.1)";
                      el.style.backgroundColor = "rgba(255,255,255,0.04)";
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg overflow-hidden shrink-0 flex items-center justify-center ${
                      isSelected ? "bg-white/20" : "bg-white/[0.06] backdrop-blur-xl"
                    }`}>
                      {campaign.image ? (
                        <img src={campaign.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className={`text-sm font-bold ${isSelected ? "text-white" : "text-fg-subtle"}`}>
                          {campaign.title[0]}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className={`font-bold text-sm truncate ${
                        isSelected ? "text-white" : "text-fg"
                      }`}>
                        {campaign.title}
                      </h3>
                      <p className={`text-[11px] mt-0.5 transition-colors duration-300 ${
                        isSelected ? "text-white/70" : "text-fg-muted group-hover:text-fg"
                      }`}>
                        {campaign.category} ·{" "}
                        <span
                          className="transition-colors duration-300"
                          style={!isSelected ? { color: "rgb(127,191,127)" } : undefined}
                          onMouseEnter={(e) => {
                            if (!isSelected) e.currentTarget.style.color = cardAccent.color;
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) e.currentTarget.style.color = "rgb(127,191,127)";
                          }}
                        >
                          {campaign.raised.toFixed(1)} SOL
                        </span>{" "}
                        raised
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}

            <Link
              href="/create"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border-2 border-dashed border-white/15 bg-white/[0.04] backdrop-blur-xl text-sm font-semibold text-fg-muted transition-all duration-500 ease-out hover:border-amber-500/50 hover:text-amber-400 hover:shadow-[0_0_12px_rgba(245,158,11,0.15)]"
            >
              <span>+</span> New Campaign
            </Link>
          </div>

          {selectedCampaign && (
            <motion.div
              key={selectedCampaign.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 space-y-4"
            >
              <motion.div
                whileHover={{ y: -3, scale: 1.005, boxShadow: CARD_ACCENTS[4].shadow, borderColor: CARD_ACCENTS[4].border }}
                transition={hoverSpring}
                className={glassCard + " p-6"}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-wider font-semibold text-fg-muted mb-1">
                      Live Progress
                    </p>
                    <h2 className="text-3xl font-bold text-fg tabular-nums">
                      <AnimatedNumber to={selectedCampaign.raised} decimals={1} />
                      <span className="text-base font-semibold text-fg-muted ml-1">SOL</span>
                    </h2>
                    <p className="text-sm text-fg-muted mt-1">
                      raised of{" "}
                      <span className="font-semibold text-fg">
                        {selectedCampaign.goal.toLocaleString()} SOL
                      </span>{" "}
                      goal
                    </p>

                    <div className="mt-4 max-w-xs">
                      <ProgressBar value={selectedCampaign.raised} max={selectedCampaign.goal} showPercentage={false} />
                    </div>
                  </div>

                  <div className="relative w-24 h-24 shrink-0 ml-4">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
                      <circle
                        cx="50" cy="50" r="45"
                        fill="none"
                        stroke="url(#progressGrad)"
                        strokeWidth="8"
                        strokeDasharray={`${selectedCampaign.progress * 2.83} 283`}
                        strokeLinecap="round"
                        style={{ transition: "stroke-dasharray 0.8s ease" }}
                        transform="rotate(-90 50 50)"
                      />
                      <defs>
                        <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="var(--primary)" />
                          <stop offset="100%" stopColor="var(--accent)" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-bold text-sm text-fg">{selectedCampaign.progress}%</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="grid grid-cols-2 gap-4">
                <Link
                  href={`/campaign/${selectedCampaign.id}`}
                  className="group bg-white/[0.04] backdrop-blur-2xl border border-white/20 rounded-2xl p-5 text-white transition-all duration-500 ease-out hover:shadow-[0_0_40px_rgba(245,158,11,0.25)] hover:border-amber-500/50 hover:bg-amber-500/15"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                      <ShareIcon size={18} />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm">Share Campaign</h3>
                      <p className="text-xs text-white/70 mt-0.5">Get the word out</p>
                    </div>
                    <ArrowRight size={16} className="ml-auto opacity-50 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>

                <PostImpact
                  campaignId={selectedCampaign.id}
                  campaignTitle={selectedCampaign.title}
                  campaignImage={selectedCampaign.image}
                  creatorAddress={creatorAddress}
                  onPostSuccess={async () => {
                    const response = await fetch(
                      `/api/campaigns?creator=${encodeURIComponent(creatorAddress)}`,
                      { cache: "no-store" },
                    );
                    const payload = (await response.json()) as { campaigns?: CampaignRecord[] };
                    setMyCampaigns((payload.campaigns ?? []).filter((campaign) => !campaign.verified));
                  }}
                />
              </div>

              <motion.div
                whileHover={{ y: -3, scale: 1.005, boxShadow: CARD_ACCENTS[7].shadow, borderColor: CARD_ACCENTS[7].border }}
                transition={hoverSpring}
                className={glassCard + " p-6"}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-fg">Recent Donations</h3>
                  {selectedCampaign.donations.length > 0 && (
                    <Link
                      href={`/campaign/${selectedCampaign.id}`}
                      className="text-xs font-semibold text-accent hover:text-accent-hover transition-colors inline-flex items-center gap-1"
                    >
                      View All
                      <ArrowRight size={12} />
                    </Link>
                  )}
                </div>

                {selectedCampaign.donations.length > 0 ? (
                  <div className="space-y-2">
                    {selectedCampaign.donations.slice(0, 4).map((donation) => (
                      <div
                        key={donation.id}
                        className="group flex items-center justify-between p-3 bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-xl transition-all duration-300 hover:bg-pink-500/10 hover:border-pink-500/30"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Avatar address={donation.donor} size={36} />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-fg truncate">
                              {truncateAddress(donation.donor)}
                            </p>
                            <p className="text-[11px] text-fg-muted">
                              {new Date(donation.timestamp).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm font-bold shrink-0 ml-3 tabular-nums transition-colors duration-300 group-hover:text-pink-300" style={{ color: "rgb(127,191,127)" }}>
                          +{donation.amount.toFixed(2)} SOL
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Gift size={20} className="text-fg-subtle" />
                    </div>
                    <p className="text-sm text-fg-muted">No donations yet</p>
                    <Link
                      href={`/campaign/${selectedCampaign.id}`}
                      className="text-xs font-semibold text-accent hover:underline mt-2 inline-block"
                    >
                      Share your campaign to start receiving donations →
                    </Link>
                  </div>
                )}
              </motion.div>

              <div className="grid grid-cols-2 gap-3">
                {([
                  { icon: Eye, label: "Total Views", value: getCampaignStats(selectedCampaign.id).views, accent: 0 },
                  { icon: MousePointer2, label: "Clicks", value: getCampaignStats(selectedCampaign.id).clicks, accent: 1 },
                  { icon: ShareIcon, label: "Shares", value: getCampaignStats(selectedCampaign.id).shares, accent: 2 },
                  { icon: Heart, label: "Interactions", value: getCampaignStats(selectedCampaign.id).interactions, accent: 3 },
                ] as const).map((stat) => {
                  const Icon = stat.icon;
                  const accent = CARD_ACCENTS[stat.accent];
                  return (
                    <motion.div
                      key={stat.label}
                      whileHover={{ y: -3, scale: 1.01, boxShadow: accent.shadow, borderColor: accent.border }}
                      transition={hoverSpring}
                      className={glassCard + " p-4 cursor-default"}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Icon size={16} style={{ color: accent.color }} />
                        <p className="text-[10px] uppercase tracking-wider font-semibold text-fg-muted">{stat.label}</p>
                      </div>
                      <p className="text-2xl font-bold text-fg tabular-nums">{stat.value}</p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
