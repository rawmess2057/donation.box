import { ActionGetResponse, ACTIONS_CORS_HEADERS } from "@solana/actions";
import { getCampaignById } from "@/lib/server/campaignRepository";

export const GET = async (req: Request) => {
  try {
    const url = new URL(req.url);
    const campaignId = url.searchParams.get("campaignId");

    if (!campaignId) {
      return new Response(JSON.stringify({ error: "Missing campaignId parameter" }), {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    const campaign = await getCampaignById(campaignId);
    if (!campaign) {
      return new Response(JSON.stringify({ error: "Campaign not found" }), {
        status: 404,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    const progress = Math.min(100, Math.round((campaign.raised / campaign.goal) * 100));

    const action: ActionGetResponse = {
      type: "action",
      title: campaign.title,
      icon: campaign.image,
      description: `${campaign.story}\n\nGoal: ${campaign.goal} SOL | Raised: ${campaign.raised} SOL | Progress: ${progress}%`,
      label: "Donate to Campaign",
      error: {
        message: "Invalid request",
      },
      links: {
        actions: [
          {
            type: "transaction",
            label: "Donate 0.1 SOL",
            href: `/api/actions/donate/confirm?campaignId=${campaignId}&amount=0.1`,
          },
          {
            type: "transaction",
            label: "Donate 0.5 SOL",
            href: `/api/actions/donate/confirm?campaignId=${campaignId}&amount=0.5`,
          },
          {
            type: "transaction",
            label: "Donate 1 SOL",
            href: `/api/actions/donate/confirm?campaignId=${campaignId}&amount=1`,
          },
          {
            type: "transaction",
            label: "Donate custom amount",
            href: `/api/actions/donate/confirm?campaignId=${campaignId}&amount={amount}`,
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
  } catch {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
};

export const OPTIONS = GET;
