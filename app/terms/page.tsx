import { Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-bg relative overflow-hidden">
      <div
        className="absolute top-[8%] right-[3%] w-[160px] h-[60px] pointer-events-none z-0"
        style={{
          background: "linear-gradient(135deg, rgba(127,191,127,0.08), rgba(127,191,127,0.02))",
          clipPath: "polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)",
        }}
      />
      <div
        className="absolute bottom-[15%] left-[2%] w-[140px] h-[140px] pointer-events-none z-0"
        style={{
          background: "linear-gradient(135deg, rgba(3,225,255,0.06), rgba(3,225,255,0.02))",
          clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
        }}
      />

      <div className="relative max-w-4xl mx-auto px-4 py-10 z-[2]">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={22} className="text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold text-fg font-[family-name:var(--font-heading)]">
            Terms of Service
          </h1>
        </div>
        <p className="text-fg-muted mb-10 text-sm">Last updated: June 2026</p>

        <div className="bg-gradient-to-br from-primary/[0.04] via-transparent to-accent/[0.02] backdrop-blur-2xl border border-white/10 rounded-2xl p-8 space-y-6 text-sm text-fg-muted leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-fg mb-3 font-[family-name:var(--font-heading)]">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Donation.Box, you agree to be bound by these Terms of Service. If you do not agree, do not use the platform. We may update these terms at any time; continued use constitutes acceptance of the changes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-fg mb-3 font-[family-name:var(--font-heading)]">2. Description of Service</h2>
            <p>
              Donation.Box is a decentralized crowdfunding platform that facilitates direct SOL transfers between donors and campaign creators on the Solana blockchain. We are a non-custodial platform — we never hold, control, or have access to user funds. All transactions occur directly on the blockchain.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-fg mb-3 font-[family-name:var(--font-heading)]">3. Eligibility</h2>
            <p>
              You must be at least 18 years old to use Donation.Box. Campaign creators must be verified partner NGOs or INGOs. Donors must have a compatible Solana wallet and sufficient SOL to cover donations and network fees.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-fg mb-3 font-[family-name:var(--font-heading)]">4. Donations</h2>
            <p>
              All donations are final and non-refundable. Donations are direct on-chain SOL transfers to the campaign creator&apos;s wallet address. Donation.Box does not facilitate refunds, chargebacks, or disputes. Donors are responsible for verifying campaign legitimacy before donating.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-fg mb-3 font-[family-name:var(--font-heading)]">5. Creator Obligations</h2>
            <p>
              Campaign creators must use funds as described in their campaign. Creators agree to post regular impact updates. Misrepresentation or misuse of funds may result in removal from the platform. Donation.Box reserves the right to remove campaigns that violate these terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-fg mb-3 font-[family-name:var(--font-heading)]">6. Limitation of Liability</h2>
            <p>
              Donation.Box is provided &quot;as is&quot; without warranties of any kind. We are not responsible for: blockchain network issues, failed transactions, wallet incompatibility, or the actions of campaign creators. We are not liable for any damages arising from use of the platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-fg mb-3 font-[family-name:var(--font-heading)]">7. Prohibited Activities</h2>
            <p>
              You may not use Donation.Box for illegal activities, fraud, money laundering, or any purpose that violates applicable laws. We reserve the right to block access to users engaging in prohibited activities.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-fg mb-3 font-[family-name:var(--font-heading)]">8. Privacy</h2>
            <p>
              We do not collect personal information beyond what is necessary to operate the platform. Wallet addresses and donation amounts are public on the Solana blockchain. We do not sell or share user data with third parties.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-fg mb-3 font-[family-name:var(--font-heading)]">9. Governing Law</h2>
            <p>
              These terms are governed by applicable laws. Any disputes shall be resolved through binding arbitration. Users are responsible for complying with their local laws regarding cryptocurrency donations.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-fg mb-3 font-[family-name:var(--font-heading)]">10. Contact</h2>
            <p>
              For questions about these terms, reach out through our Discord or X (Twitter) channels. We aim to respond within 48 hours.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
