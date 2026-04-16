"use client";

import { useMemo, useState, useEffect } from "react";
import CampaignGrid from "@/components/campaigns/CampaignGrid";
import type { Campaign } from "@/components/campaigns/types";
import { readCreatedCampaigns } from "@/lib/campaignStore";

const ALL_CAMPAIGNS: Campaign[] = [
  {
    id: "1",
    title: "Help 127 children go to school in Sindhupalchok",
    image: "/school.png",
    raised: 3200,
    goal: 5000,
    progress: 64,
    category: "Education",
  },
  {
    id: "2",
    title: "Landslide Relief - Gorkha District",
    image: "/landslide.png",
    raised: 8400,
    goal: 10000,
    progress: 84,
    category: "Emergency",
  },
  {
    id: "3",
    title: "Nutrition for 85 kids in Kathmandu slums",
    image: "/nutrition.png",
    raised: 1200,
    goal: 2000,
    progress: 60,
    category: "Nutrition",
  },
  {
    id: "4",
    title: "Solar Power for Remote Mustang Schools",
    image: "/school.png",
    raised: 4100,
    goal: 7000,
    progress: 59,
    category: "Environment",
  },
  {
    id: "5",
    title: "Harvesting Hope: Kathmandu Community Kitchen",
    image: "/nutrition.png",
    raised: 2750,
    goal: 6500,
    progress: 42,
    category: "Health",
  },
  {
    id: "6",
    title: "Clean Water Access in Dolakha Villages",
    image: "/landslide.png",
    raised: 5100,
    goal: 12000,
    progress: 43,
    category: "Emergency",
  },
];

function useCreatedCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    // Load created campaigns from localStorage only on client
    setCampaigns(readCreatedCampaigns() as Campaign[]);
  }, []);

  return campaigns;
}

export default function ExplorePage() {
  const createdCampaigns = useCreatedCampaigns();
  const mergedCampaigns: Campaign[] = useMemo(() => {
    return [...createdCampaigns, ...ALL_CAMPAIGNS];
  }, [createdCampaigns]);
  const categories = useMemo(
    () => Array.from(new Set(mergedCampaigns.map((item) => item.category))),
    [mergedCampaigns],
  );

  return (
    <main className="min-h-screen bg-[#FFF9F0] px-4 pt-28 pb-10">
      <section className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold text-[#1f2937]">Explore Campaigns</h1>
        <p className="mt-2 text-sm text-stone-600">
          Discover verified causes across education, health, emergency, and more.
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

      <CampaignGrid title="All Campaigns" campaigns={mergedCampaigns} />

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
                    <span className="font-semibold">Goal:</span> $
                    {campaign.goal.toLocaleString()}
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
