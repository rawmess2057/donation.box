import { NextResponse, type NextRequest } from "next/server";
import { getCampaignById } from "@/lib/server/campaignRepository";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/campaigns/[id]">,
) {
  try {
    const { id } = await ctx.params;
    const campaign = await getCampaignById(id);

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    return NextResponse.json({ campaign });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
