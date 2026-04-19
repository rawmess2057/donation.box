import { NextRequest, NextResponse } from "next/server";
import { CreatedCampaign } from "@/lib/campaignStore";

// Mock campaigns data
const MOCK_CAMPAIGNS: Record<
  string,
  {
    title: string;
    description: string;
    image: string;
    goal: number;
    raised: number;
    creator?: string; // For mock campaigns, uses env variable
  }
> = {
  "1": {
    title: "Help rebuild classrooms destroyed by landslide",
    description: "Over 200 children in Sindhupalchok need safe learning spaces.",
    image: "https://donate-blink.vercel.app/school.png",
    goal: 5000,
    raised: 1240,
  },
  "2": {
    title: "Landslide Relief - Gorkha District",
    description: "Emergency shelter and food kits for affected families.",
    image: "https://donate-blink.vercel.app/landslide.png",
    goal: 10000,
    raised: 8400,
  },
};

/**
 * GET /api/campaigns/[id]
 * Retrieves campaign details including creator info
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const campaignId = params.id;

    if (!campaignId) {
      return NextResponse.json(
        { error: "Missing campaign ID" },
        { status: 400 }
      );
    }

    // Check mock campaigns first
    if (MOCK_CAMPAIGNS[campaignId]) {
      const mockCampaign = MOCK_CAMPAIGNS[campaignId];
      return NextResponse.json({
        id: campaignId,
        title: mockCampaign.title,
        description: mockCampaign.description,
        image: mockCampaign.image,
        goal: mockCampaign.goal,
        raised: mockCampaign.raised,
        creator: process.env.NEXT_PUBLIC_DONATION_RECIPIENT, // Use env var for mock campaigns
      });
    }

    // For user-created campaigns, we would fetch from database
    // This is a placeholder - in production, fetch from your database
    return NextResponse.json(
      { error: "Campaign not found" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Error fetching campaign:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
