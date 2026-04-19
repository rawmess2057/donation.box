import { NextResponse } from "next/server";
import { getFeedItems } from "@/lib/server/campaignRepository";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const sortByParam = url.searchParams.get("sortBy");
  const sortBy =
    sortByParam === "trending" || sortByParam === "topDonations"
      ? sortByParam
      : "latest";

  const items = await getFeedItems(sortBy);
  return NextResponse.json({ items });
}
