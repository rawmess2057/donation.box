import Link from "next/link";
import HeroSection from "@/components/hero/HeroSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import CampaignShowcaseGrid from "@/components/sections/CampaignShowcaseGrid";
import CreatorsSection from "@/components/sections/CreatorsSection";
import DonorsSection from "@/components/sections/DonorsSection";
import TechSection from "@/components/sections/TechSection";
import VideoShowcaseSection from "@/components/sections/VideoShowcaseSection";
import type { Campaign } from "@/components/campaigns/types";
import {
  sortCampaignsByTrending,
  sortCampaignsByLatest,
} from "@/lib/campaigns";
import { getAllCampaigns } from "@/lib/server/campaignRepository";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const allCampaigns: Campaign[] = await getAllCampaigns();
  const trendingCampaigns = sortCampaignsByTrending(allCampaigns);
  const latestCampaigns = sortCampaignsByLatest(allCampaigns);
  return (
    <main className="bg-bg">
      <HeroSection />

      <section id="hero-next" className="px-4 pt-20 pb-12">
        <div className="max-w-7xl mx-auto glass-surface rounded-3xl px-6 py-5 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-primary text-4xl font-bold leading-none tabular-nums">24.8 SOL</p>
            <p className="text-fg-muted text-xs md:text-sm uppercase tracking-wide mt-1">
              Funds Raised
            </p>
          </div>
          <div>
            <p className="text-accent text-4xl font-bold leading-none tabular-nums">3</p>
            <p className="text-fg-muted text-xs md:text-sm uppercase tracking-wide mt-1">
              Featured Campaigns
            </p>
          </div>
          <div>
            <p className="text-success text-4xl font-bold leading-none">1000</p>
            <p className="text-fg-muted text-xs md:text-sm uppercase tracking-wide mt-1">
              Donors
            </p>
          </div>
        </div>
      </section>

      <HowItWorksSection />

      <CampaignShowcaseGrid trending={trendingCampaigns} latest={latestCampaigns} />

      <CreatorsSection />

      <DonorsSection />

      <TechSection />

      <VideoShowcaseSection />

      <section className="px-4 pb-16">
        <div className="max-w-7xl mx-auto rounded-3xl bg-gradient-to-r from-accent via-accent-hover to-accent py-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white/20 glass-surface animate-glass-float liquid-glass" />
            <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-white/20 glass-surface animate-glass-float-2" style={{ filter: "url(#glass-subtle)" }} />
          </div>
          <h2 className="text-white text-4xl md:text-5xl font-bold leading-tight font-[family-name:var(--font-heading)]">
            Ready to make a difference
            <br />
            in your community?
          </h2>

          <Link
            href="/create"
            className="inline-block mt-8 bg-white/[0.04] backdrop-blur-2xl border border-white/20 text-accent font-semibold px-8 py-3 rounded-full hover:bg-accent/15 hover:text-white hover:border-accent/50 hover:shadow-[0_0_40px_rgba(3,225,255,0.25)] transition-all duration-500 ease-out"
          >
            Start Your Own Campaign
          </Link>
        </div>
      </section>
    </main>
  );
}
