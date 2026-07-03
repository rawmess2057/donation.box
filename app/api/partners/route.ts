import { NextResponse } from "next/server";
import { getAllPartners, addPartner } from "@/lib/server/partnerRepository";
import { verifyAdminSignature, buildAdminMessage } from "@/lib/server/verifyAdmin";
import type { Partner } from "@/lib/partners";

export const runtime = "nodejs";

export async function GET() {
  const partners = await getAllPartners();
  return NextResponse.json({ partners });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      partner: Omit<Partner, "approvedAt">;
      adminSignature?: string;
      adminTimestamp?: number;
      adminMessage?: string;
    };

    const { partner, adminSignature, adminTimestamp, adminMessage } = body;

    if (!partner?.wallet || !partner?.orgName) {
      return NextResponse.json(
        { error: "Missing required partner fields (wallet, orgName)" },
        { status: 400 },
      );
    }

    if (adminSignature && adminTimestamp && adminMessage) {
      if (Math.abs(Date.now() - adminTimestamp) > 60_000) {
        return NextResponse.json(
          { error: "Admin signature expired. Try again." },
          { status: 401 },
        );
      }
      if (!verifyAdminSignature(adminSignature, adminMessage)) {
        return NextResponse.json(
          { error: "Invalid admin signature." },
          { status: 401 },
        );
      }
    } else {
      const adminWallet = process.env.ADMIN_WALLET;
      if (!adminWallet) {
        return NextResponse.json(
          { error: "No admin wallet configured on server." },
          { status: 500 },
        );
      }
      return NextResponse.json(
        {
          error: "Admin signature required.",
          adminMessage: buildAdminMessage("add_partner", partner, Date.now()),
        },
        { status: 401 },
      );
    }

    const record: Partner = {
      ...partner,
      approvedAt: new Date().toISOString(),
    };

    await addPartner(record);
    return NextResponse.json({ partner: record }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to add partner",
      },
      { status: 500 },
    );
  }
}
