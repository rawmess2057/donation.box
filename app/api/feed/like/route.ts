import { NextResponse } from "next/server";
import { incrementFeedLike } from "@/lib/server/campaignRepository";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const itemId = body.itemId;

    if (!itemId) {
      return NextResponse.json({ error: "Missing itemId" }, { status: 400 });
    }

    const updated = await incrementFeedLike(itemId);
    if (!updated) {
      return NextResponse.json({ error: "Feed item not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to update like",
      },
      { status: 500 },
    );
  }
}
