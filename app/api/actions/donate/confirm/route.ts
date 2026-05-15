import {
  ActionPostResponse,
  ACTIONS_CORS_HEADERS,
  createPostResponse,
} from "@solana/actions";
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
} from "@solana/web3.js";
import { getCampaignById } from "@/lib/server/campaignRepository";

const NETWORK = process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet";

export const POST = async (req: Request) => {
  try {
    const url = new URL(req.url);
    const campaignId = url.searchParams.get("campaignId");
    const amountStr = url.searchParams.get("amount");

    if (!campaignId || !amountStr) {
      return new Response(JSON.stringify({ error: "Missing campaignId or amount" }), {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    const campaign = await getCampaignById(campaignId);
    const recipientAddress =
      campaign?.creator || process.env.NEXT_PUBLIC_DONATION_RECIPIENT;

    if (!recipientAddress) {
      return new Response(JSON.stringify({ error: "Recipient address not configured" }), {
        status: 500,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    const body = (await req.json()) as { account?: string };
    const payerString = body.account;

    if (!payerString) {
      return new Response(JSON.stringify({ error: "Missing account" }), {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    let payer: PublicKey;
    let recipient: PublicKey;

    try {
      payer = new PublicKey(payerString);
      recipient = new PublicKey(recipientAddress);
    } catch {
      return new Response(JSON.stringify({ error: "Invalid addresses" }), {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    const amount = Number.parseFloat(amountStr);
    if (Number.isNaN(amount) || amount <= 0 || amount > 1000) {
      return new Response(JSON.stringify({ error: "Invalid donation amount" }), {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    const connection = new Connection(
      clusterApiUrl(NETWORK as "devnet" | "testnet" | "mainnet-beta"),
      "confirmed",
    );

    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

    const transaction = new Transaction({
      feePayer: payer,
      blockhash,
      lastValidBlockHeight,
    }).add(
      SystemProgram.transfer({
        fromPubkey: payer,
        toPubkey: recipient,
        lamports: Math.round(amount * LAMPORTS_PER_SOL),
      }),
    );

    const actionResponse: ActionPostResponse = await createPostResponse({
      fields: {
        type: "transaction",
        transaction,
      },
    });

    return new Response(JSON.stringify(actionResponse), {
      headers: ACTIONS_CORS_HEADERS,
      status: 200,
    });
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : "Unknown error",
      }),
      {
        status: 500,
        headers: ACTIONS_CORS_HEADERS,
      },
    );
  }
};

export const OPTIONS = GET;

async function GET() {
  return new Response(null, { headers: ACTIONS_CORS_HEADERS });
}
