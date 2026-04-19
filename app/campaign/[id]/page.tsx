"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import CampaignDonateClient from "@/components/campaigns/CampaignDonateClient";
import ShareButton from "@/components/campaigns/ShareButton";
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
