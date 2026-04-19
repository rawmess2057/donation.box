"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, MousePointer2, Share as ShareIcon, Heart } from "lucide-react";
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
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const selectedCampaign = useMemo(
    () => myCampaigns.find((campaign) => campaign.id === selectedCampaignId) ?? myCampaigns[0] ?? null,
    [myCampaigns, selectedCampaignId],
  );

  useEffect(() => {
    let active = true;

    async function loadCampaigns() {
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

  if (myCampaigns.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFF9F0] px-4 py-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-[#97422F] mb-4">My Campaigns</h1>
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <p className="text-lg text-stone-600 mb-4">
              You haven&apos;t created any campaigns yet.
            </p>
            <Link
              href="/create"
              className="inline-block bg-[#97422F] text-white font-bold py-3 px-8 rounded-full hover:bg-[#8B3F24] transition"
            >
              Create Your First Campaign
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F0] px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-[#97422F] mb-8">My Campaigns</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="space-y-3">
              {myCampaigns.map((campaign) => (
                <button
                  key={campaign.id}
                  onClick={() => setSelectedCampaignId(campaign.id)}
                  className={`w-full text-left p-4 rounded-xl transition ${
                    selectedCampaign?.id === campaign.id
                      ? "bg-[#97422F] text-white shadow-lg"
                      : "bg-white text-stone-900 hover:bg-stone-50"
                  }`}
                >
                  <h3 className="font-bold text-sm line-clamp-2">{campaign.title}</h3>
                  <p
                    className={`text-xs mt-1 ${
                      selectedCampaign?.id === campaign.id ? "opacity-80" : "text-stone-600"
                    }`}
                  >
                    {campaign.category}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {selectedCampaign && (
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-stone-500 mb-1">
                      Live Progress
                    </p>
                    <h2 className="text-2xl font-bold text-[#97422F]">
                      {selectedCampaign.raised.toLocaleString()} SOL
                    </h2>
                    <p className="text-xs text-stone-600 mt-1">
                      raised of {selectedCampaign.goal.toLocaleString()} SOL goal
                    </p>
                  </div>

                  <div className="relative w-24 h-24">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#E5E2DA" strokeWidth="8" />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#97422F"
                        strokeWidth="8"
                        strokeDasharray={`${selectedCampaign.progress * 2.83} 283`}
                        strokeLinecap="round"
                        style={{ transition: "stroke-dasharray 0.5s ease" }}
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-bold text-sm text-[#97422F]">
                        {selectedCampaign.progress}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gradient-to-br from-[#AEEEEB] to-[#93D2CF] rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#266866] flex items-center justify-center flex-shrink-0">
                      <ShareIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-[#1C1C17] mb-1">Share the Magic</h3>
                      <p className="text-sm text-[#55423E]">
                        Get your supporters to share this campaign and reach more people.
                      </p>
                    </div>
                  </div>
                </div>

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

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-[#1C1C17] mb-4">Recent Donations</h3>
                <div className="space-y-3">
                  {selectedCampaign.donations.length > 0 ? (
                    selectedCampaign.donations.slice(0, 4).map((donation) => (
                      <div
                        key={donation.id}
                        className="flex items-center justify-between p-3 bg-stone-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#97422F] flex items-center justify-center text-white text-xs font-bold">
                            {donation.donor[0]}
                          </div>
                          <div>
                            <span className="text-sm font-medium text-stone-900">
                              {truncateAddress(donation.donor)}
                            </span>
                            <span className="text-xs text-stone-500 ml-2">(verified)</span>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-[#97422F]">
                          +{donation.amount.toFixed(2)} SOL
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-stone-500 py-4 text-center">
                      No donations yet
                    </p>
                  )}
                </div>
                <Link
                  href={`/campaign/${selectedCampaign.id}`}
                  className="text-xs font-bold text-[#266866] hover:underline mt-4 inline-block"
                >
                  View All →
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Eye, label: "Total Views", value: getCampaignStats(selectedCampaign.id).views },
                  { icon: MousePointer2, label: "Total Clicks", value: getCampaignStats(selectedCampaign.id).clicks },
                  { icon: ShareIcon, label: "Total Shares", value: getCampaignStats(selectedCampaign.id).shares },
                  { icon: Heart, label: "Interactions", value: getCampaignStats(selectedCampaign.id).interactions },
                ].map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="flex items-center gap-3 mb-2">
                        <Icon size={18} className="text-[#97422F]" />
                        <p className="text-xs uppercase tracking-wide text-stone-500">{stat.label}</p>
                      </div>
                      <p className="text-2xl font-bold text-[#1C1C17]">{stat.value}</p>
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
