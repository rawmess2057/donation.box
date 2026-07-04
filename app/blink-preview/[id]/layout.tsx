import type { Metadata } from "next";
import { getCampaignById } from "@/lib/server/campaignRepository";

type Props = {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const campaign = await getCampaignById(id);
  if (!campaign) {
    return { title: "Campaign Not Found | Donation.Box" };
  }

  const description = campaign.subtitle || campaign.story?.slice(0, 160);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  return {
    title: campaign.title,
    description,
    openGraph: {
      title: campaign.title,
      description,
      url: `${baseUrl}/blink-preview/${id}`,
      images: campaign.image ? [{ url: campaign.image }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: campaign.title,
      description,
      images: campaign.image ? [campaign.image] : [],
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
