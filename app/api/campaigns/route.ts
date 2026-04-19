import { NextResponse } from "next/server";
import { createCampaign, getAllCampaigns } from "@/lib/server/campaignRepository";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const creator = url.searchParams.get("creator");
  const campaigns = await getAllCampaigns();

  const filtered = creator
    ? campaigns.filter((campaign) => campaign.creator === creator)
    : campaigns;

  return NextResponse.json({ campaigns: filtered });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      title,
      subtitle,
      category,
      story,
      image,
      goal,
      raised,
      currency,
      creator,
      txSignature,
      createdAt,
      verified,
    } = body;

    if (
      !id ||
      !title ||
      !category ||
      !story ||
      !Number.isFinite(goal) ||
      !creator ||
      !txSignature ||
      !createdAt
    ) {
      return NextResponse.json(
        { error: "Missing required campaign fields" },
        { status: 400 },
      );
    }

    const campaign = await createCampaign({
      id,
      title,
      subtitle: subtitle || category,
      category,
      story,
      image: image || "/school.png",
      goal,
      raised: Number.isFinite(raised) ? raised : 0,
      currency: currency === "SOL" ? "SOL" : "SOL",
      creator,
      txSignature,
      createdAt,
      verified: Boolean(verified),
    });

    return NextResponse.json({ campaign }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create campaign",
      },
      { status: 500 },
    );
  }
}
