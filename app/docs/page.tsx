"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const sections = [
  {
    title: "Getting Started",
    content: (
      <ul className="space-y-3 text-fg-muted">
        <li><strong className="text-fg">Connect Your Wallet</strong> — Use the wallet button in the navigation bar to connect Phantom, Backpack, or any Solana wallet. All donations go directly from your wallet to the campaign creator — no middleman.</li>
        <li><strong className="text-fg">Browse Campaigns</strong> — Explore campaigns on the Explore page. Each campaign shows its goal, progress, and story. Donations go entirely to the creator.</li>
        <li><strong className="text-fg">Make a Donation</strong> — Pick a campaign, enter an amount (0.1, 0.5, 1 SOL or custom), and confirm the transaction in your wallet. You&apos;ll receive a confirmation with transaction details.</li>
      </ul>
    ),
  },
  {
    title: "For Donors",
    content: (
      <ul className="space-y-3 text-fg-muted">
        <li><strong className="text-fg">Donation Flow</strong> — Every donation is a direct on-chain SOL transfer. We never custody your funds. Transactions are visible on the Solana Explorer.</li>
        <li><strong className="text-fg">Solana Blinks</strong> — Share a campaign using Solana Blinks. Recipients can donate directly from their wallet without visiting the site. Blinks work with Phantom and Backpack mobile wallets.</li>
        <li><strong className="text-fg">Impact Tracking</strong> — After donating, you can follow the campaign&apos;s progress. Creators post impact updates with proof photos to show how funds are used.</li>
      </ul>
    ),
  },
  {
    title: "For Creators",
    content: (
      <ul className="space-y-3 text-fg-muted">
        <li><strong className="text-fg">Partner Application</strong> — Only verified partner NGOs and INGOs can create campaigns. Apply through the partner registration flow. Approval is manual to ensure legitimacy.</li>
        <li><strong className="text-fg">Creating a Campaign</strong> — Once approved, fill in the campaign details: title, story, goal amount, images, and category. Campaigns are stored on-chain via Solana.</li>
        <li><strong className="text-fg">Sharing & Updates</strong> — Use the dashboard to share your campaign via Blinks or social media. Post impact updates with photos to show donors the real-world effect of their contributions.</li>
      </ul>
    ),
  },
  {
    title: "Technical Overview",
    content: (
      <ul className="space-y-3 text-fg-muted">
        <li><strong className="text-fg">Solana Blockchain</strong> — Donation.Box is built on Solana for fast, low-cost transactions. Each donation is a simple SOL transfer — no smart contracts, no intermediary fees.</li>
        <li><strong className="text-fg">Transaction Fees</strong> — Solana transaction fees are fractions of a cent. You pay only the network fee (~0.000005 SOL per transaction). No platform fees.</li>
        <li><strong className="text-fg">Non-Custodial</strong> — We never hold your funds. Donations flow directly from donor to creator wallet. Our platform only facilitates discovery and verification.</li>
      </ul>
    ),
  },
];

const glassCard =
  "bg-gradient-to-br from-primary/[0.04] via-transparent to-accent/[0.02] backdrop-blur-2xl border border-white/10 rounded-2xl";

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-bg relative overflow-hidden">
      <motion.div
        className="absolute top-[8%] right-[3%] w-[160px] h-[60px] pointer-events-none z-0"
        style={{
          background: "linear-gradient(135deg, rgba(127,191,127,0.08), rgba(127,191,127,0.02))",
          clipPath: "polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)",
        }}
        animate={{ x: [0, -12, 8, 0], y: [0, 6, -4, 0], rotate: [0, 2, -1, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[15%] left-[2%] w-[140px] h-[140px] pointer-events-none z-0"
        style={{
          background: "linear-gradient(135deg, rgba(3,225,255,0.06), rgba(3,225,255,0.02))",
          clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
        }}
        animate={{ x: [0, 10, -6, 0], y: [0, -8, 4, 0], rotate: [0, 4, -2, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />

      <div className="relative max-w-4xl mx-auto px-4 py-10 z-[2]">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 14 }}
          className="flex items-center gap-2 mb-2"
        >
          <Sparkles size={22} className="text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold text-fg font-[family-name:var(--font-heading)]">
            Documentation
          </h1>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-fg-muted mb-10 text-sm"
        >
          Everything you need to know about using Donation.Box
        </motion.p>

        <div className="space-y-6">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className={glassCard + " p-6 transition-all duration-500 ease-out hover:shadow-[0_0_30px_rgba(127,191,127,0.08)]"}
            >
              <h2 className="text-xl font-bold text-fg mb-4 font-[family-name:var(--font-heading)]">
                {i + 1}. {section.title}
              </h2>
              {section.content}
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
