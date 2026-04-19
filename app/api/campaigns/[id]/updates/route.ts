import { NextResponse } from "next/server";
import { addCampaignUpdate } from "@/lib/server/campaignRepository";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  ctx: RouteContext<"/api/campaigns/[id]/updates">,
) {
  try {
    const { id } = await ctx.params;
    const body = await request.json();
    const { content, image, video } = body;

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Update content is required" },
        { status: 400 },
      );
    }

    const campaign = await addCampaignUpdate(id, {
      content,
      image,
      video,
    });

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    return NextResponse.json({ campaign });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to save update",
      },
      { status: 500 },
    );
  }
}
