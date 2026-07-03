import { NextResponse } from "next/server";
import { removePartner } from "@/lib/server/partnerRepository";
import { verifyAdminSignature, buildAdminMessage } from "@/lib/server/verifyAdmin";

export const runtime = "nodejs";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ wallet: string }> },
) {
  try {
    const { wallet } = await params;

    const body = (await request.json()) as {
      adminSignature?: string;
      adminTimestamp?: number;
      adminMessage?: string;
    };

    const { adminSignature, adminTimestamp, adminMessage } = body;

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
          adminMessage: buildAdminMessage("remove_partner", { wallet }, Date.now()),
        },
        { status: 401 },
      );
    }

    const removed = await removePartner(wallet);
    if (!removed) {
      return NextResponse.json(
        { error: "Partner not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to remove partner",
      },
      { status: 500 },
    );
  }
}
