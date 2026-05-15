import { NextResponse } from "next/server";
import { addCampaignDonation } from "@/lib/server/campaignRepository";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  ctx: RouteContext<"/api/campaigns/[id]/donations">,
) {
  try {
    const { id } = await ctx.params;
    const body = await request.json();
    const { donor, amount, signature, timestamp } = body;

    if (!donor || !Number.isFinite(amount) || !signature) {
      return NextResponse.json(
        { error: "Missing donation details" },
        { status: 400 },
      );
    }

    const campaign = await addCampaignDonation(id, {
      donor,
      amount,
      signature,
      timestamp: Number.isFinite(timestamp) ? timestamp : Date.now(),
    });

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    return NextResponse.json({ campaign });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to save donation",
      },
      { status: 500 },
    );
  }
}
