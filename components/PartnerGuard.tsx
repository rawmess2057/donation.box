"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { ShieldBan, ShieldCheck, Loader2 } from "lucide-react";
import type { Partner } from "@/lib/partners";

type PartnerGuardProps = {
  children: React.ReactNode;
};

export default function PartnerGuard({ children }: PartnerGuardProps) {
  const { publicKey, connected } = useWallet();
  const [status, setStatus] = useState<"loading" | "partner" | "non-partner" | "unconnected">("loading");
  const [partner, setPartner] = useState<Partner | null>(null);

  useEffect(() => {
    if (!connected || !publicKey) {
      setStatus("unconnected");
      return;
    }

    const wallet = publicKey.toBase58();
    setStatus("loading");

    fetch(`/api/partners/check?wallet=${encodeURIComponent(wallet)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.isPartner && data.partner) {
          setPartner(data.partner);
          setStatus("partner");
        } else {
          setStatus("non-partner");
        }
      })
      .catch(() => {
        setStatus("unconnected");
      });
  }, [publicKey, connected]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-fg-muted">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-sm">Checking partner status...</p>
      </div>
    );
  }

  if (status === "unconnected") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
        <ShieldBan className="h-12 w-12 text-fg-subtle" />
        <h2 className="text-xl font-bold text-fg font-[family-name:var(--font-heading)]">
          Wallet Required
        </h2>
        <p className="text-sm text-fg-muted max-w-md text-center">
          Connect your Solana wallet to create a campaign. Only partner organizations can launch campaigns.
        </p>
      </div>
    );
  }

  if (status === "non-partner") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
        <ShieldBan className="h-12 w-12 text-red-400" />
        <h2 className="text-xl font-bold text-fg font-[family-name:var(--font-heading)]">
          Partner Access Only
        </h2>
        <p className="text-sm text-fg-muted max-w-md text-center">
          Only partner NGOs and INGOs can create campaigns on Donation.Box.
          If you represent an organization, reach out to us to become a partner.
        </p>
        <a
          href="mailto:partners@donation.box"
          className="mt-2 inline-flex items-center gap-2 rounded-xl bg-white/[0.04] backdrop-blur-2xl border border-white/20 text-accent px-5 py-2.5 text-sm font-semibold transition-all duration-500 ease-out shadow-[0_0_15px_rgba(3,225,255,0.1)] hover:shadow-[0_0_40px_rgba(3,225,255,0.25)] hover:border-accent/50 hover:text-white hover:bg-accent/15"
        >
          Apply for Partnership
        </a>
      </div>
    );
  }

  return (
    <div>
      {partner && (
        <div className="mx-auto mb-6 flex max-w-xl items-center justify-center gap-2 rounded-xl border border-accent/30 bg-accent-soft px-4 py-2.5 text-sm text-accent">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          <span>
            Creating as <strong>{partner.orgName}</strong> ({partner.type})
          </span>
        </div>
      )}
      {children}
    </div>
  );
}
