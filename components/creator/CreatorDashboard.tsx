"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, MousePointer2, Share as ShareIcon, Heart, Sparkles, TrendingUp, Gift, Wallet, ArrowRight } from "lucide-react";
import Link from "next/link";
import { truncateAddress } from "@/lib/transactionFetcher";
import PostImpact from "@/components/impact/PostImpact";
import type { CampaignRecord } from "@/lib/campaigns";

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
    const hash = campaignId
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return {
      views: 100 + (hash % 100),
      clicks: 300 + (hash % 200),
      shares: 10 + (hash % 20),
      interactions: 15 + (hash % 20),
    };
  };

  // Aggregate stats
  const totalRaised = myCampaigns.reduce((sum, c) => sum + c.raised, 0);
  const totalDonations = myCampaigns.reduce((sum, c) => sum + c.donations.length, 0);
  const totalGoal = myCampaigns.reduce((sum, c) => sum + c.goal, 0);

  const TOP_STATS = [
    { icon: Gift, label: "Total Campaigns", value: myCampaigns.length, color: "from-[#C25D2E] to-[#A14D25]", bg: "bg-orange-50" },
    { icon: TrendingUp, label: "Total Raised", value: `${totalRaised.toFixed(1)} SOL`, color: "from-[#266866] to-[#1E6E6B]", bg: "bg-teal-50" },
    { icon: Heart, label: "Total Donations", value: totalDonations, color: "from-[#C25D2E] to-[#97422F]", bg: "bg-rose-50" },
    { icon: Wallet, label: "Progress", value: totalGoal > 0 ? `${Math.round((totalRaised / totalGoal) * 100)}%` : "0%", color: "from-[#4f6b2f] to-[#3d5624]", bg: "bg-lime-50" },
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF9F0] px-4 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 bg-stone-300 rounded-lg" />
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-stone-300 rounded-xl" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 h-64 bg-stone-300 rounded-xl" />
              <div className="lg:col-span-2 h-96 bg-stone-300 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (myCampaigns.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFF9F0] px-4 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles size={22} className="text-[#C25D2E]" />
            <h1 className="text-3xl font-bold text-stone-900">My Campaigns</h1>
          </div>
          <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-stone-200">
            <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Gift size={28} className="text-stone-400" />
            </div>
            <h2 className="text-xl font-bold text-stone-900 mb-2">No campaigns yet</h2>
            <p className="text-stone-500 text-sm max-w-md mx-auto mb-6">
              You haven&apos;t created any campaigns. Start your first one and make an impact!
            </p>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 bg-[#C25D2E] text-white font-bold py-3 px-8 rounded-xl hover:bg-[#A14D25] transition-all duration-200 hover:shadow-lg hover:shadow-orange-200/50"
            >
              Create Your First Campaign
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F0]">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <Sparkles size={22} className="text-[#C25D2E]" />
          <h1 className="text-3xl font-bold text-stone-900">My Campaigns</h1>
        </div>

        {/* Top stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {TOP_STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={`${stat.bg} rounded-2xl px-4 py-3.5 animate-card-in`}
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon size={14} className="text-stone-500" />
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-stone-500">
                    {stat.label}
                  </p>
                </div>
                <p className="text-2xl font-bold text-stone-900">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Campaign list sidebar */}
          <div className="lg:col-span-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-3 px-1">
              Select a campaign
            </p>
            <div className="space-y-2">
              {myCampaigns.map((campaign, i) => (
                <button
                  key={campaign.id}
                  onClick={() => setSelectedCampaignId(campaign.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all duration-300 animate-card-in ${
                    selectedCampaign?.id === campaign.id
                      ? "bg-[#C25D2E] text-white shadow-md shadow-orange-200/50"
                      : "bg-white text-stone-900 hover:bg-stone-100 hover:shadow-sm border border-stone-200"
                  }`}
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  <div className="flex items-center gap-3">
                    {/* Mini thumbnail */}
                    <div className={`w-10 h-10 rounded-lg overflow-hidden shrink-0 flex items-center justify-center ${
                      selectedCampaign?.id === campaign.id
                        ? "bg-white/20"
                        : "bg-stone-100"
                    }`}>
                      {campaign.image ? (
                        <img
                          src={campaign.image}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className={`text-sm font-bold ${selectedCampaign?.id === campaign.id ? "text-white" : "text-stone-400"}`}>
                          {campaign.title[0]}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className={`font-bold text-sm truncate ${
                        selectedCampaign?.id === campaign.id ? "text-white" : "text-stone-900"
                      }`}>
                        {campaign.title}
                      </h3>
                      <p className={`text-[11px] mt-0.5 ${
                        selectedCampaign?.id === campaign.id ? "text-white/70" : "text-stone-500"
                      }`}>
                        {campaign.category} · {campaign.raised.toFixed(1)} SOL raised
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Quick create */}
            <Link
              href="/create"
              className="mt-3 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border-2 border-dashed border-stone-300 text-sm font-semibold text-stone-500 hover:border-[#C25D2E] hover:text-[#C25D2E] transition-all duration-200 animate-card-in"
            >
              <span>+</span> New Campaign
            </Link>
          </div>

          {/* Detail panel */}
          {selectedCampaign && (
            <div className="lg:col-span-2 space-y-4">
              {/* Progress card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 animate-card-in">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-wider font-semibold text-stone-500 mb-1">
                      Live Progress
                    </p>
                    <h2 className="text-3xl font-bold text-stone-900">
                      {selectedCampaign.raised.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })}
                      <span className="text-base font-semibold text-stone-500 ml-1">SOL</span>
                    </h2>
                    <p className="text-sm text-stone-500 mt-1">
                      raised of{" "}
                      <span className="font-semibold text-stone-700">
                        {selectedCampaign.goal.toLocaleString()} SOL
                      </span>{" "}
                      goal
                    </p>

                    {/* Progress bar */}
                    <div className="mt-4 h-2.5 rounded-full bg-stone-100 overflow-hidden max-w-xs">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#C25D2E] to-[#266866] transition-all duration-700 ease-out"
                        style={{ width: `${Math.min(100, selectedCampaign.progress)}%` }}
                      />
                    </div>
                  </div>

                  {/* Circular progress */}
                  <div className="relative w-24 h-24 shrink-0 ml-4">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#F0EDE6" strokeWidth="8" />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
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
                          <stop offset="0%" stopColor="#C25D2E" />
                          <stop offset="100%" stopColor="#266866" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-bold text-sm text-stone-700">{selectedCampaign.progress}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions row */}
              <div className="grid grid-cols-2 gap-4 animate-card-in">
                <Link
                  href={`/campaign/${selectedCampaign.id}`}
                  className="group bg-gradient-to-r from-[#266866] to-[#1E6E6B] rounded-2xl p-5 text-white hover:shadow-lg hover:shadow-teal-200/50 transition-all duration-300"
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

                <div className="animate-card-in">
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
              </div>

              {/* Recent donations */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 animate-card-in">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-stone-900">Recent Donations</h3>
                  {selectedCampaign.donations.length > 0 && (
                    <Link
                      href={`/campaign/${selectedCampaign.id}`}
                      className="text-xs font-semibold text-[#1E6E6B] hover:text-[#155552] transition-colors inline-flex items-center gap-1"
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
                        className="flex items-center justify-between p-3 bg-stone-50 rounded-xl hover:bg-stone-100 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C25D2E] to-[#97422F] flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {donation.donor[0]}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-stone-900 truncate">
                              {truncateAddress(donation.donor)}
                            </p>
                            <p className="text-[11px] text-stone-500">
                              {new Date(donation.timestamp).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-[#C25D2E] shrink-0 ml-3">
                          +{donation.amount.toFixed(2)} SOL
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Gift size={20} className="text-stone-400" />
                    </div>
                    <p className="text-sm text-stone-500">No donations yet</p>
                    <Link
                      href={`/campaign/${selectedCampaign.id}`}
                      className="text-xs font-semibold text-[#1E6E6B] hover:underline mt-2 inline-block"
                    >
                      Share your campaign to start receiving donations →
                    </Link>
                  </div>
                )}
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3">
                {([
                  { icon: Eye, label: "Total Views", value: getCampaignStats(selectedCampaign.id).views },
                  { icon: MousePointer2, label: "Clicks", value: getCampaignStats(selectedCampaign.id).clicks },
                  { icon: ShareIcon, label: "Shares", value: getCampaignStats(selectedCampaign.id).shares },
                  { icon: Heart, label: "Interactions", value: getCampaignStats(selectedCampaign.id).interactions },
                ] as const).map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={stat.label}
                      className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 animate-card-in"
                      style={{ animationDelay: `${0.15 + i * 0.05}s` }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Icon size={16} className="text-[#C25D2E]" />
                        <p className="text-[10px] uppercase tracking-wider font-semibold text-stone-500">
                          {stat.label}
                        </p>
                      </div>
                      <p className="text-2xl font-bold text-stone-900">{stat.value}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
