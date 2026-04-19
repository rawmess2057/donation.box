"use client";

import { useEffect, useMemo, useState } from "react";
import CampaignGrid from "@/components/campaigns/CampaignGrid";
import type { Campaign } from "@/components/campaigns/types";

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
  const createdCampaigns = useMemo(
    () => campaigns.filter((campaign) => !campaign.verified),
    [campaigns],
  );

  return (
    <main className="min-h-screen bg-[#FFF9F0] px-4 pt-28 pb-10">
      <section className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold text-[#1f2937]">Explore Campaigns</h1>
        <p className="mt-2 text-sm text-stone-600">
          Discover campaigns and test shared Solana devnet flows across the app.
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

      {createdCampaigns.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-8">
          <h2 className="mb-4 text-2xl font-bold text-[#1f2937]">
            Created on Devnet
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {createdCampaigns.map((campaign) => (
              <article
                key={campaign.id}
                className="rounded-2xl bg-[#F2EEE7] p-4 shadow-sm"
              >
                <h3 className="text-xl font-semibold text-stone-900">
                  {campaign.title}
                </h3>
                <p className="mt-1 text-sm text-stone-700">{campaign.story}</p>

                <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-stone-700">
                  <p>
                    <span className="font-semibold">Category:</span>{" "}
                    {campaign.category}
                  </p>
                  <p>
                    <span className="font-semibold">Goal:</span>{" "}
                    {campaign.goal.toLocaleString()} SOL
                  </p>
                  <p className="col-span-2">
                    <span className="font-semibold">Creator:</span>{" "}
                    {campaign.creator}
                  </p>
                  <p className="col-span-2">
                    <span className="font-semibold">Image:</span> {campaign.image}
                  </p>
                </div>

                <a
                  href={`https://explorer.solana.com/tx/${campaign.txSignature}?cluster=devnet`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block text-sm font-semibold text-[#1E6E6B] underline"
                >
                  View transaction on Solana Explorer
                </a>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
