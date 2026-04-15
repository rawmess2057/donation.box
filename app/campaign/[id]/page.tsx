import Image from "next/image";
import { notFound } from "next/navigation";
import DonationPanel from "@/components/campaigns/DonationPanel";

type CampaignDetail = {
  id: string;
  title: string;
  subtitle: string;
  story: string;
  image: string;
  raised: number;
  goal: number;
  currency: "USDC" | "USD";
  verified: boolean;
};

const MOCK_CAMPAIGNS: CampaignDetail[] = [
  {
    id: "1",
    title: "Help rebuild classrooms destroyed by landslide",
    subtitle: "Over 200 children in Sindhupalchok need safe learning spaces.",
    story:
      "Your donation helps provide desks, books, and roofing so students can return to class. This campaign is community-led and audited for transparent spending.",
    image: "/school.png",
    raised: 1240,
    goal: 5000,
    currency: "USDC",
    verified: true,
  },
  {
    id: "2",
    title: "Landslide Relief - Gorkha District",
    subtitle: "Emergency shelter and food kits for affected families.",
    story:
      "Local volunteers are coordinating immediate relief and short-term rehabilitation for displaced households in high-risk zones.",
    image: "/landslide.png",
    raised: 8400,
    goal: 10000,
    currency: "USDC",
    verified: true,
  },
  {
    id: '3',
    title: 'Nutrition for 85 kids in Kathmandu slums',
    subtitle: 'Help provide essential nutrients to children in need.',
    story: 'Your donation helps provide essential nutrients to children in need. This campaign is community-led and audited for transparent spending.',
    image: '/nutrition.png',
    raised: 1200,
    goal: 2000,
    currency: "USDC",
    verified: true,
    
  },
];

function getCampaignById(id: string) {
  return MOCK_CAMPAIGNS.find((c) => c.id === id);
}

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const campaign = getCampaignById(id);

  if (!campaign) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#F7F3EC] px-4 pt-28 py-10">
      <section className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
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

        <DonationPanel
          raised={campaign.raised}
          goal={campaign.goal}
          currency={campaign.currency}
        />
      </section>
    </main>
  );
}