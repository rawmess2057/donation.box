import Link from "next/link";
import CampaignGrid from "@/components/campaigns/CampaignGrid";
import ProjectDiscoveryFeed from "@/components/campaigns/ProjectDiscoveryFeed";
import type { Campaign } from "@/components/campaigns/types";
import {
  sortCampaignsByTrending,
  sortCampaignsByLatest,
} from "@/lib/campaigns";
import { getAllCampaigns } from "@/lib/server/campaignRepository";
import { getNetworkLabel } from "@/lib/explorer";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const allCampaigns: Campaign[] = await getAllCampaigns();
  const trendingCampaigns = sortCampaignsByTrending(allCampaigns).slice(0, 3);
  const latestCampaigns = sortCampaignsByLatest(allCampaigns).slice(0, 3);
  return (
    <main className="bg-bg">
      <section className="relative min-h-[90vh] flex items-center pt-28 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-primary/20 to-accent/10 glass animate-glass-float" style={{ filter: "url(#glass-medium)" }} />
        <div className="absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-accent/20 to-success/10 glass animate-glass-float-2" style={{ filter: "url(#glass-subtle)" }} />
        <div className="absolute top-1/2 left-1/3 h-[200px] w-[200px] rounded-full bg-gradient-to-bl from-success/20 to-primary/10 glass animate-glass-float-3" style={{ filter: "url(#glass-heavy)" }} />

        <div className="absolute top-20 right-[15%] h-3 w-3 rounded-full bg-primary/20 animate-pulse-glow" />
        <div className="absolute bottom-40 left-[10%] h-2 w-2 rounded-full bg-accent/25 animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/3 right-[8%] h-4 w-4 rounded-full bg-success/15 animate-pulse-glow" style={{ animationDelay: "0.8s" }} />
        <div className="absolute bottom-1/4 right-[20%] h-2 w-2 rounded-full bg-primary/15 animate-pulse-glow" style={{ animationDelay: "2.2s" }} />

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <span className="animate-fade-in-up inline-block mb-6 rounded-full bg-primary-soft px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
            Decentralized Crowdfunding on Solana
          </span>

          <h1 className="animate-fade-in-up-1 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.1] tracking-tight text-fg font-[family-name:var(--font-heading)]">
            Rebuilding Hope,
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-success bg-clip-text text-transparent animate-shimmer">
              One Community
            </span>
            <br />
            at a Time
          </h1>

          <p className="animate-fade-in-up-2 mt-6 text-lg md:text-xl text-fg-muted max-w-2xl mx-auto leading-relaxed">
            Join our mission to empower rural Nepali communities through
            sustainable crowdfunding and transparent fundraising on Solana.
          </p>

          <div className="animate-fade-in-up-3 mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/explore"
              className="group bg-primary hover:bg-primary-hover text-white font-semibold text-lg px-10 py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-glow hover:shadow-xl hover:-translate-y-0.5"
            >
              Start Exploring
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">&rarr;</span>
            </Link>

            <Link
              href="/create"
              className="group bg-bg-card border-2 border-accent text-accent hover:bg-accent hover:text-white font-semibold text-lg px-10 py-4 rounded-2xl transition-all duration-300 hover:-translate-y-0.5"
            >
              Start a Campaign
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">&rarr;</span>
            </Link>
          </div>

          <div className="animate-fade-in-up-4 mt-16 flex justify-center">
            <div className="group animate-bounce rounded-full border-2 border-border p-2 hover:border-primary/40 hover:bg-primary-soft transition-colors duration-300">
              <svg className="h-5 w-5 text-fg-subtle group-hover:text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pt-10 pb-12">
        <div className="max-w-7xl mx-auto glass-card rounded-3xl px-6 py-5 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-primary text-4xl font-bold leading-none tabular-nums">24.8 SOL</p>
            <p className="text-fg-muted text-xs md:text-sm uppercase tracking-wide mt-1">
              Demo Liquidity
            </p>
          </div>
          <div>
            <p className="text-accent text-4xl font-bold leading-none tabular-nums">3</p>
            <p className="text-fg-muted text-xs md:text-sm uppercase tracking-wide mt-1">
              Featured Campaigns
            </p>
          </div>
          <div>
            <p className="text-success text-4xl font-bold leading-none">{getNetworkLabel()}</p>
            <p className="text-fg-muted text-xs md:text-sm uppercase tracking-wide mt-1">
              Ready to Test
            </p>
          </div>
        </div>
      </section>

      <ProjectDiscoveryFeed
        campaigns={allCampaigns}
        title="Discover Projects"
        description="Trending campaigns making an impact right now"
        className="mb-8"
      />

      <CampaignGrid title="Trending Campaigns" campaigns={trendingCampaigns}>
        <Link
          href="/explore"
          className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:text-accent-hover transition"
        >
          View all campaigns
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </CampaignGrid>

      <CampaignGrid title="Latest Campaigns" campaigns={latestCampaigns}>
        <Link
          href="/explore"
          className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:text-accent-hover transition"
        >
          View all campaigns
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </CampaignGrid>

      <section className="px-4 pb-16">
        <div className="max-w-7xl mx-auto rounded-3xl bg-gradient-to-r from-accent via-accent-hover to-accent py-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white/20 glass animate-glass-float" style={{ filter: "url(#glass-subtle)" }} />
            <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-white/20 glass animate-glass-float-2" style={{ filter: "url(#glass-medium)" }} />
          </div>
          <h2 className="text-white text-4xl md:text-5xl font-bold leading-tight font-[family-name:var(--font-heading)]">
            Ready to make a difference
            <br />
            in your community?
          </h2>

          <Link
            href="/create"
            className="inline-block mt-8 bg-white text-accent font-semibold px-8 py-3 rounded-full hover:bg-bg-muted transition"
          >
            Start Your Own Campaign
          </Link>
        </div>
      </section>
    </main>
  );
}
