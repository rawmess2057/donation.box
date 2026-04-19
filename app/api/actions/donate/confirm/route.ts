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

/**
 * Blink Action: Transaction Confirmation
 * POST /api/actions/donate/confirm?campaignId={id}&amount={amount}&recipient={address}
 *
 * Receives wallet address from client, builds and returns a transaction
 * ready to be signed by the wallet.
 */

const NETWORK = process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet";

export const POST = async (req: Request) => {
  try {
    const url = new URL(req.url);
    const campaignId = url.searchParams.get("campaignId");
    const amountStr = url.searchParams.get("amount");
    const recipientParam = url.searchParams.get("recipient");

    if (!campaignId || !amountStr) {
      return new Response(
        JSON.stringify({
          error: "Missing campaignId or amount",
        }),
        {
          status: 400,
          headers: ACTIONS_CORS_HEADERS,
        }
      );
    }

    // Use recipient from parameter, or fall back to env variable
    const recipientAddress = recipientParam || process.env.NEXT_PUBLIC_DONATION_RECIPIENT;

    if (!recipientAddress) {
      return new Response(
        JSON.stringify({
          error: "Recipient address not configured",
        }),
        {
          status: 500,
          headers: ACTIONS_CORS_HEADERS,
        }
      );
    }

    // Parse request body to get payer wallet
    const body = await req.json();
    const payerString = body.account;

    if (!payerString) {
      return new Response(
        JSON.stringify({
          error: "Missing account",
        }),
        {
          status: 400,
          headers: ACTIONS_CORS_HEADERS,
        }
      );
    }

    // Validate addresses
    let payer: PublicKey;
    let recipient: PublicKey;

    try {
      payer = new PublicKey(payerString);
      recipient = new PublicKey(recipientAddress);
    } catch (err) {
      return new Response(
        JSON.stringify({
          error: "Invalid addresses",
        }),
        {
          status: 400,
          headers: ACTIONS_CORS_HEADERS,
        }
      );
    }

    // Parse and validate amount
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0 || amount > 1000) {
      return new Response(
        JSON.stringify({
          error: "Invalid donation amount",
        }),
        {
          status: 400,
          headers: ACTIONS_CORS_HEADERS,
        }
      );
    }

    // Create connection and fetch recent blockhash
    const connection = new Connection(
      clusterApiUrl(NETWORK as any),
      "confirmed"
    );

    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();

    // Build transaction
    const transaction = new Transaction({
      feePayer: payer,
      blockhash,
      lastValidBlockHeight,
    }).add(
      SystemProgram.transfer({
        fromPubkey: payer,
        toPubkey: recipient,
        lamports: Math.round(amount * LAMPORTS_PER_SOL),
      })
    );

    // Serialize transaction for signing
    const serialized = transaction.serialize({ requireAllSignatures: false });
    const base64 = serialized.toString("base64");

    const actionResponse: ActionPostResponse = await createPostResponse({
      fields: {
        transaction: base64,
      },
    });

    return new Response(JSON.stringify(actionResponse), {
      headers: ACTIONS_CORS_HEADERS,
      status: 200,
    });
  } catch (err) {
    console.error("Transaction builder error:", err);
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : "Unknown error",
      }),
      {
        status: 500,
        headers: ACTIONS_CORS_HEADERS,
      }
    );
  }
};

export const OPTIONS = GET;

async function GET(req: Request) {
  return new Response(null, { headers: ACTIONS_CORS_HEADERS });
}
