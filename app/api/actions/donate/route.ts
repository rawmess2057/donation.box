import { ActionGetResponse, ACTIONS_CORS_HEADERS } from "@solana/actions";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

/**
 * Blink Action: Campaign Donation
 * GET /api/actions/donate?campaignId={id}
 *
 * Returns a Solana Action that allows users to donate to a campaign via Blink.
 */

// Mock campaigns - in production, this would query a database
const MOCK_CAMPAIGNS: Record<
  string,
  {
    title: string;
    description: string;
    image: string;
    goal: number;
    raised: number;
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

async function getCampaignById(id: string) {
  // First check mock campaigns
  if (MOCK_CAMPAIGNS[id]) {
    return {
      ...MOCK_CAMPAIGNS[id],
      creator: process.env.NEXT_PUBLIC_DONATION_RECIPIENT,
    };
  }

  // Try to fetch user-created campaigns from the campaigns API
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/campaigns/${id}`);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error("Error fetching campaign from API:", error);
  }

  return null;
}

export const GET = async (req: Request) => {
  try {
    const url = new URL(req.url);
    const campaignId = url.searchParams.get("campaignId");

    if (!campaignId) {
      return new Response(
        JSON.stringify({
          error: "Missing campaignId parameter",
        }),
        {
          status: 400,
          headers: ACTIONS_CORS_HEADERS,
        }
      );
    }

    const campaign = await getCampaignById(campaignId);
    if (!campaign) {
      return new Response(
        JSON.stringify({
          error: "Campaign not found",
        }),
        {
          status: 404,
          headers: ACTIONS_CORS_HEADERS,
        }
      );
    }

    // Calculate progress percentage
    const progress = Math.min(100, Math.round((campaign.raised / campaign.goal) * 100));
    const remaining = Math.max(0, campaign.goal - campaign.raised);

    // Get recipient (creator or default)
    const recipient = campaign.creator || process.env.NEXT_PUBLIC_DONATION_RECIPIENT;

    // Build the action response with recipient parameter
    const action: ActionGetResponse = {
      type: "action",
      title: campaign.title,
      icon: campaign.image,
      description: `${campaign.description}\n\nGoal: $${campaign.goal} | Raised: $${campaign.raised} | Progress: ${progress}%`,
      label: "Donate to Campaign",
      error: {
        message: "Invalid request",
      },
      links: {
        actions: [
          {
            label: "Donate 0.1 SOL",
            href: `/api/actions/donate/confirm?campaignId=${campaignId}&amount=0.1&recipient=${recipient}`,
          },
          {
            label: "Donate 0.5 SOL",
            href: `/api/actions/donate/confirm?campaignId=${campaignId}&amount=0.5&recipient=${recipient}`,
          },
          {
            label: "Donate 1 SOL",
            href: `/api/actions/donate/confirm?campaignId=${campaignId}&amount=1&recipient=${recipient}`,
          },
          {
            label: "Donate custom amount",
            href: `/api/actions/donate/confirm?campaignId=${campaignId}&amount={amount}&recipient=${recipient}`,
            parameters: [
              {
                name: "amount",
                label: "Amount in SOL",
                required: true,
              },
            ],
          },
        ],
      },
    };

    return new Response(JSON.stringify(action), {
      headers: ACTIONS_CORS_HEADERS,
      status: 200,
    });
  } catch (err) {
    console.error("Blink action error:", err);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
      }),
      {
        status: 500,
        headers: ACTIONS_CORS_HEADERS,
      }
    );
  }
};

export const OPTIONS = GET;
