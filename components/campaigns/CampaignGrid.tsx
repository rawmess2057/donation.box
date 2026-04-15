// components/campaigns/CampaignGrid.tsx
import { Campaign } from "./types";
import CampaignCard from "./CampaignCard";

type Props = {
  title?: string;
  campaigns: Campaign[];
};

export default function CampaignGrid({ title = "Trending Campaigns", campaigns }: Props) {
  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-6">{title}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      </div>
    </section>
  );
}