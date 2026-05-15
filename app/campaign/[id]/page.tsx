"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import CampaignDonateClient from "@/components/campaigns/CampaignDonateClient";
import ShareButton from "@/components/campaigns/ShareButton";
import { getExplorerTxUrl } from "@/lib/explorer";
import type { CampaignRecord } from "@/lib/campaigns";

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
          if (active) {
            setCampaign(null);
          }
          return;
        }

        const payload = (await response.json()) as { campaign?: CampaignRecord };
        if (active) {
          setCampaign(payload.campaign ?? null);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void loadCampaign();

    return () => {
      active = false;
    };
  }, [id]);

  return (
    <main className="min-h-screen bg-[#F7F3EC] px-4 pt-28 py-10">
      <section className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
        {isLoading ? (
          <div className="md:col-span-3 text-center py-10 text-stone-600">
            Loading campaign...
          </div>
        ) : !campaign ? (
          <div className="md:col-span-3 text-center py-10">
            <h1 className="text-3xl font-bold text-[#1f2937]">Campaign not found</h1>
            <p className="mt-2 text-stone-600">
              This campaign doesn&apos;t exist or has been removed.
            </p>
          </div>
        ) : (
          <>
            <article className="md:col-span-2 rounded-2xl bg-[#F2EEE7] p-5 shadow-sm">
              <div className="relative mb-5 overflow-hidden rounded-xl">
                <Image
                  src={campaign.image}
                  alt={campaign.title}
                  width={1200}
                  height={700}
                  className="h-[320px] w-full object-cover"
                  priority
                />
                {campaign.verified && (
                  <span className="absolute left-3 top-3 rounded-full bg-[#2D7774] px-3 py-1 text-xs font-semibold text-white">
                    Verified cause
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-bold leading-tight text-[#1f2937]">
                {campaign.title}
              </h1>
              <p className="mt-2 text-sm text-stone-600">{campaign.subtitle}</p>

              <div className="my-5 h-px bg-stone-300" />

              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-stone-600">
                The Story
              </h2>
              <p className="leading-relaxed text-stone-700">{campaign.story}</p>

              {/* Campaign metadata */}
              <div className="mt-6 rounded-xl bg-white/70 p-4 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-stone-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-stone-700">
                    {campaign.category}
                  </span>
                  {!campaign.verified && (
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                      User Created
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  {campaign.creator && (
                    <div className="col-span-2 md:col-span-1">
                      <span className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                        Creator
                      </span>
                      <p className="mt-0.5 font-mono text-xs text-stone-700 break-all">
                        {campaign.creator.slice(0, 4)}...{campaign.creator.slice(-4)}
                      </p>
                    </div>
                  )}
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                      Goal
                    </span>
                    <p className="mt-0.5 text-stone-700">
                      {campaign.goal.toLocaleString()} SOL
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                      Raised
                    </span>
                    <p className="mt-0.5 text-stone-700 font-semibold">
                      {campaign.raised.toLocaleString()} SOL
                    </p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                      Created
                    </span>
                    <p className="mt-0.5 text-stone-700">
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
                  className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1E6E6B] hover:text-[#155552] transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View on Solana Explorer
                </a>
              </div>
            </article>

            <aside className="flex flex-col gap-4">
              <ShareButton campaignId={id} campaignTitle={campaign.title} />
              <CampaignDonateClient
                raised={campaign.raised}
                goal={campaign.goal}
                currency={campaign.currency}
                recipientAddress={campaign.creator}
                campaignId={campaign.verified ? undefined : id}
                campaignTitle={campaign.title}
                campaignImage={campaign.image}
                campaignCreator={campaign.creator}
                onDonationSuccess={(amount) => {
                  setCampaign((current) =>
                    current
                      ? {
                          ...current,
                          raised: current.raised + amount,
                        }
                      : current,
                  );
                }}
              />
            </aside>
          </>
        )}
      </section>
    </main>
  );
}
