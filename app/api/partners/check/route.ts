import { NextResponse } from "next/server";
import { getPartnerByWallet } from "@/lib/server/partnerRepository";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const wallet = url.searchParams.get("wallet");

  if (!wallet) {
    return NextResponse.json(
      { error: "Missing wallet query parameter" },
      { status: 400 },
    );
  }

  const partner = await getPartnerByWallet(wallet);
  return NextResponse.json({
    isPartner: partner !== null,
    partner,
  });
}
