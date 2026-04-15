// components/campaigns/CampaignCard.tsx
import Image from "next/image";
import { Campaign } from "./types";
import Link from "next/link";

type Props = { campaign: Campaign };

export default function CampaignCard({ campaign }: Props) {
  return (
    <article className="rounded-2xl bg-white overflow-hidden shadow-sm">
      <Image src={campaign.image} alt={campaign.title} width={420} height={230} className="w-full h-48 object-cover" />
      <div className="p-4 space-y-3">
        <h3 className="text-xl font-semibold">{campaign.title}</h3>
        <p className="text-sm text-stone-600">
          ${campaign.raised.toLocaleString()} raised
        </p>
        <div className="h-2 rounded bg-stone-200">
          <div className="h-2 rounded bg-green-600" style={{ width: `${campaign.progress}%` }} />
        </div>
        <div className="flex justify-between text-xs text-stone-500">
          <span>Goal: ${campaign.goal.toLocaleString()}</span>
          <span>{campaign.progress}%</span>
        </div>
        <Link href={`/campaign/${campaign.id}`} className="bg-[#A14D25] text-white px-4 py-2 rounded-lg">Donate Now</Link>
      </div>
    </article>
  );
}