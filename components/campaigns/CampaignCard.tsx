// components/campaigns/CampaignCard.tsx
import Image from "next/image";
import { Campaign } from "./types";
import Link from "next/link";

type Props = { campaign: Campaign; index?: number };

const CATEGORY_COLORS: Record<string, string> = {
  Education: "bg-amber-100 text-amber-800",
  Emergency: "bg-rose-100 text-rose-800",
  Nutrition: "bg-emerald-100 text-emerald-800",
  Health: "bg-blue-100 text-blue-800",
  Environment: "bg-teal-100 text-teal-800",
};

function getCategoryStyle(category: string) {
  return CATEGORY_COLORS[category] ?? "bg-stone-100 text-stone-800";
}

export default function CampaignCard({ campaign, index = 0 }: Props) {
  const staggerClass =
    index < 3 ? [`animate-card-in`, `animate-card-in-1`, `animate-card-in-2`][index] : "animate-card-in";

  return (
    <article
      className={`group relative rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-500 ease-out hover:-translate-y-1 ${staggerClass}`}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden rounded-t-2xl">
        <Image
          src={campaign.image}
          alt={campaign.title}
          width={420}
          height={230}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 420px"
        />

        {/* Category badge */}
        <span
          className={`absolute top-3 left-3 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider shadow-sm ${getCategoryStyle(campaign.category)}`}
        >
          {campaign.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <h3 className="text-lg font-bold leading-snug text-stone-900 line-clamp-2">
          {campaign.title}
        </h3>

        {campaign.subtitle && (
          <p className="text-sm text-stone-500 leading-relaxed line-clamp-2">
            {campaign.subtitle}
          </p>
        )}

        {/* Raised amount + donors */}
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-xl font-bold text-stone-900">
              {campaign.raised.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })}
            </span>
            <span className="text-sm text-stone-500 ml-1">
              SOL raised
            </span>
          </div>
          {campaign.donations.length > 0 && (
            <span className="text-xs text-stone-400">
              {campaign.donations.length} donor{campaign.donations.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Progress bar */}
        <div className="h-2.5 rounded-full bg-stone-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#C25D2E] to-[#266866] transition-all duration-700 ease-out"
            style={{ width: `${Math.min(100, campaign.progress)}%` }}
          />
        </div>

        {/* Goal + percentage */}
        <div className="flex justify-between text-xs text-stone-400">
          <span>Goal: {campaign.goal.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })} SOL</span>
          <span className="font-semibold text-stone-500">
            {campaign.progress}%
          </span>
        </div>

        {/* Donate button */}
        <Link
          href={`/campaign/${campaign.id}`}
          className="block w-full text-center bg-[#C25D2E] hover:bg-[#A14D25] text-white font-semibold text-sm px-5 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-orange-200/50 active:scale-[0.98]"
        >
          Donate Now
        </Link>
      </div>
    </article>
  );
}
