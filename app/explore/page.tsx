"use client";

import { useEffect, useMemo, useState } from "react";
import CampaignGrid from "@/components/campaigns/CampaignGrid";
import type { Campaign } from "@/components/campaigns/types";
import { getNetworkLabel } from "@/lib/explorer";

export default function ExplorePage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
  return (
    <main className="min-h-screen bg-[#FFF9F0] px-4 pt-28 pb-10">
      <section className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold text-[#1f2937]">Explore Campaigns</h1>
        <p className="mt-2 text-sm text-stone-600">
          Discover campaigns and test shared Solana {getNetworkLabel()} flows across the app.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {categories.map((category) => (
            <span
              key={category}
              className="rounded-full bg-stone-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-stone-700"
            >
              {category}
            </span>
          ))}
        </div>
      </section>

      {isLoading ? (
        <section className="mx-auto max-w-7xl px-6 py-10 text-sm text-stone-600">
          Loading campaigns...
        </section>
      ) : (
        <CampaignGrid title="All Campaigns" campaigns={campaigns} />
      )}

    </main>
  );
}
