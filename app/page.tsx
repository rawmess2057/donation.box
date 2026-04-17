import Image from 'next/image';
import CampaignGrid from '@/components/campaigns/CampaignGrid';
import type { Campaign } from '@/components/campaigns/types';
import Link from "next/link";

// ...
<Link href="/create" className="...">
  Start Your Own Campaign
</Link>

const campaigns: Campaign[] = [
  {
    id: '1',
    title: 'Help 127 children go to school in Sindhupalchok',
    image: '/school.png',
    raised: 3200,
    goal: 5000,
    progress: 64,
    category: 'Education',
  },
  {
    id: '2',
    title: 'Landslide Relief - Gorkha District',
    image: '/landslide.png',
    raised: 8400,
    goal: 10000,
    progress: 84,
    category: 'Emergency',
  },
  {
    id: '3',
    title: 'Nutrition for 85 kids in Kathmandu slums',
    image: '/nutrition.png',
    raised: 1200,
    goal: 2000,
    progress: 60,
    category: 'Nutrition',
  },
];


export default function Hero() {
  return (
    <main className="bg-[#FFF9F0]">
      <section className="min-h-screen flex items-center pt-28">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <h1 className="text-6xl md:text-7xl font-bold leading-tight text-gray-900">
              Rebuilding Hope,<br />
              <span className="text-[#C25D2E] font-serif">One Community</span><br />
              at a Time
            </h1>

            <p className="text-xl text-gray-600 max-w-lg">
              Join our mission to empower rural Nepali communities through
              sustainable crowdfunding and local heritage preservation.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/explore" className="bg-[#C25D2E] hover:bg-[#A14D25] text-white font-semibold text-lg px-10 py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-orange-200">
                Start Exploring
              </Link>

              <Link href="/impact" className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold text-lg px-10 py-4 rounded-2xl transition-all duration-300">
                Learn Our Impact
              </Link>
            </div>

            {/* Trust Signals */}
            
          </div>

          {/* Right Image */}
          <div className="relative flex justify-center md:justify-end">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-orange-100">
              <Image
                src="/unnamed.png"
                alt="Nepali child in mountains"
                width={620}
                height={720}
                className="rounded-3xl object-cover"
                priority
              />

              {/* Decorative mountain overlay */}
              
            </div>
          </div>
        </div>
      </section>

      <section className="px-4  pt-10 pb-12">
        <div className="max-w-7xl mx-auto bg-stone-200/80 rounded-3xl px-6 py-5 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-[#97422f] text-4xl font-bold leading-none">$1.2M+</p>
            <p className="text-stone-600 text-xs md:text-sm uppercase tracking-wide mt-1">Total Raised</p>
          </div>
          <div>
            <p className="text-[#266866] text-4xl font-bold leading-none">428</p>
            <p className="text-stone-600 text-xs md:text-sm uppercase tracking-wide mt-1">Communities Helped</p>
          </div>
          <div>
            <p className="text-[#4f6b2f] text-4xl font-bold leading-none">85k</p>
            <p className="text-stone-600 text-xs md:text-sm uppercase tracking-wide mt-1">Lives Impacted</p>
          </div>
        </div>
      </section>
      <CampaignGrid title="Trending Campaigns" campaigns={campaigns} />
      <section className="px-4 pb-16">
  <div className="max-w-7xl mx-auto rounded-3xl bg-gradient-to-r from-[#2f7b79] via-[#2c7473] to-[#2f7b79] py-16 text-center">
    <h2 className="text-white text-4xl md:text-5xl font-bold leading-tight">
      Ready to make a difference
      <br />
      in your community?
    </h2>

    <Link href="/create" className="inline-block mt-8 bg-white text-[#236a69] font-semibold px-8 py-3 rounded-full hover:bg-stone-100 transition">
      Start Your Own Campaign
    </Link>
  </div>
</section>
    </main>
  );
}