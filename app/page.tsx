import Link from "next/link";
import CampaignGrid from "@/components/campaigns/CampaignGrid";
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
    <main className="bg-[#FFF9F0]">
      <section className="relative min-h-[90vh] flex items-center pt-28 overflow-hidden">
        {/* Decorative background circles — floating */}
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#C25D2E]/5 animate-float" />
        <div className="absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full bg-[#266866]/5 animate-float-slow" />
        <div className="absolute top-1/2 left-1/3 h-[200px] w-[200px] rounded-full bg-[#4f6b2f]/5 animate-float-slower" />

        {/* Floating decorative dots */}
        <div className="absolute top-20 right-[15%] h-3 w-3 rounded-full bg-[#C25D2E]/20 animate-pulse-glow" />
        <div className="absolute bottom-40 left-[10%] h-2 w-2 rounded-full bg-[#266866]/25 animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/3 right-[8%] h-4 w-4 rounded-full bg-[#4f6b2f]/15 animate-pulse-glow" style={{ animationDelay: '0.8s' }} />
        <div className="absolute bottom-1/4 right-[20%] h-2 w-2 rounded-full bg-[#C25D2E]/15 animate-pulse-glow" style={{ animationDelay: '2.2s' }} />

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <span className="animate-fade-in-up inline-block mb-6 rounded-full bg-[#C25D2E]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#C25D2E]">
            Decentralized Crowdfunding on Solana
          </span>

          <h1 className="animate-fade-in-up-1 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.1] tracking-tight text-gray-900">
            Rebuilding Hope,
            <br />
            <span className="bg-gradient-to-r from-[#C25D2E] via-[#266866] to-[#4f6b2f] bg-clip-text text-transparent animate-shimmer">
              One Community
            </span>
            <br />
            at a Time
          </h1>

          <p className="animate-fade-in-up-2 mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Join our mission to empower rural Nepali communities through
            sustainable crowdfunding and transparent fundraising on Solana.
          </p>

          <div className="animate-fade-in-up-3 mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/explore"
              className="group bg-[#C25D2E] hover:bg-[#A14D25] text-white font-semibold text-lg px-10 py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-orange-200/50 hover:shadow-xl hover:shadow-orange-300/50 hover:-translate-y-0.5"
            >
              Start Exploring
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">&rarr;</span>
            </Link>

            <Link
              href="/create"
              className="group bg-white border-2 border-[#266866] text-[#266866] hover:bg-[#266866] hover:text-white font-semibold text-lg px-10 py-4 rounded-2xl transition-all duration-300 hover:-translate-y-0.5"
            >
              Start a Campaign
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">&rarr;</span>
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="animate-fade-in-up-4 mt-16 flex justify-center">
            <div className="group animate-bounce rounded-full border-2 border-stone-300 p-2 hover:border-[#C25D2E]/40 hover:bg-[#C25D2E]/5 transition-colors duration-300">
              <svg className="h-5 w-5 text-stone-400 group-hover:text-[#C25D2E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pt-10 pb-12">
        <div className="max-w-7xl mx-auto bg-stone-200/80 rounded-3xl px-6 py-5 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-[#97422f] text-4xl font-bold leading-none">24.8 SOL</p>
            <p className="text-stone-600 text-xs md:text-sm uppercase tracking-wide mt-1">
              Demo Liquidity
            </p>
          </div>
          <div>
            <p className="text-[#266866] text-4xl font-bold leading-none">3</p>
            <p className="text-stone-600 text-xs md:text-sm uppercase tracking-wide mt-1">
              Featured Campaigns
            </p>
          </div>
          <div>
            <p className="text-[#4f6b2f] text-4xl font-bold leading-none">{getNetworkLabel()}</p>
            <p className="text-stone-600 text-xs md:text-sm uppercase tracking-wide mt-1">
              Ready to Test
            </p>
          </div>
        </div>
      </section>

      <CampaignGrid title="Trending Campaigns" campaigns={trendingCampaigns}>
        <Link
          href="/explore"
          className="inline-flex items-center gap-1 text-sm font-semibold text-[#1E6E6B] hover:text-[#155552] transition"
        >
          View all campaigns
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </CampaignGrid>

      <CampaignGrid title="Latest Campaigns" campaigns={latestCampaigns}>
        <Link
          href="/explore"
          className="inline-flex items-center gap-1 text-sm font-semibold text-[#1E6E6B] hover:text-[#155552] transition"
        >
          View all campaigns
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </CampaignGrid>

      <section className="px-4 pb-16">
        <div className="max-w-7xl mx-auto rounded-3xl bg-gradient-to-r from-[#2f7b79] via-[#2c7473] to-[#2f7b79] py-16 text-center">
          <h2 className="text-white text-4xl md:text-5xl font-bold leading-tight">
            Ready to make a difference
            <br />
            in your community?
          </h2>

          <Link
            href="/create"
            className="inline-block mt-8 bg-white text-[#236a69] font-semibold px-8 py-3 rounded-full hover:bg-stone-100 transition"
          >
            Start Your Own Campaign
          </Link>
        </div>
      </section>
    </main>
  );
}
