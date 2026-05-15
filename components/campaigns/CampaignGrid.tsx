// components/campaigns/CampaignGrid.tsx
import { Campaign } from "./types";
import CampaignCard from "./CampaignCard";

type Props = {
  title?: string;
  campaigns: Campaign[];
  children?: React.ReactNode;
};

export default function CampaignGrid({ title = "Trending Campaigns", campaigns, children }: Props) {
  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-3xl font-bold text-stone-900">{title}</h2>
          {children}
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {campaigns.map((campaign, i) => (
            <CampaignCard key={campaign.id} campaign={campaign} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}