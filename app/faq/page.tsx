"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "What is Donation.Box?",
    a: "Donation.Box is a decentralized crowdfunding platform built on Solana. It connects donors directly with verified partner NGOs and INGOs — no middleman, no platform fees. Every transaction is a direct on-chain SOL transfer.",
  },
  {
    q: "How do I donate?",
    a: "Connect your Solana wallet (Phantom, Backpack, or any wallet-standard compatible wallet), browse campaigns, enter an amount, and confirm the transaction in your wallet. The SOL goes directly to the campaign creator.",
  },
  {
    q: "What are Solana Blinks?",
    a: "Solana Blinks are shareable URLs that turn any campaign into an interactive donation button. When shared on social media or messaging apps, recipients can open the link in their wallet app to donate instantly — no website needed.",
  },
  {
    q: "How do I create a campaign?",
    a: "Only verified partner NGOs and INGOs can create campaigns. Apply through the partner registration flow on your dashboard. Once approved, you can create campaigns with a title, story, goal amount, images, and category.",
  },
  {
    q: "Are there any fees?",
    a: "Zero platform fees. Donation.Box is completely non-custodial — donations flow directly from donor to creator. The only cost is the Solana network transaction fee (~0.000005 SOL per transfer).",
  },
  {
    q: "How do I know my donation is used properly?",
    a: "Campaign creators post impact updates with proof photos and descriptions. All transactions are visible on the Solana Explorer for full transparency. You can track a campaign's progress from your dashboard.",
  },
  {
    q: "What wallets are supported?",
    a: "Any Solana wallet that supports the wallet-standard specification: Phantom, Backpack, Solflare, and more. We recommend Phantom or Backpack for the best Blinks experience on mobile.",
  },
  {
    q: "Is my donation tax-deductible?",
    a: "Donation.Box facilitates peer-to-peer donations. Tax deductibility depends on the campaign creator's legal status and your local tax laws. Consult a tax professional for your specific situation.",
  },
];

const glassCard =
  "bg-gradient-to-br from-primary/[0.04] via-transparent to-accent/[0.02] backdrop-blur-2xl border border-white/10 rounded-2xl";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-bg relative overflow-hidden">
      <motion.div
        className="absolute top-[10%] right-[2%] w-[180px] h-[70px] pointer-events-none z-0"
        style={{
          background: "linear-gradient(135deg, rgba(127,191,127,0.1), rgba(127,191,127,0.03))",
          clipPath: "polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)",
        }}
        animate={{ x: [0, -15, 10, 0], y: [0, 8, -6, 0], rotate: [0, 3, -2, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[20%] left-[1%] w-[160px] h-[160px] pointer-events-none z-0"
        style={{
          background: "linear-gradient(135deg, rgba(3,225,255,0.07), rgba(3,225,255,0.02))",
          clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
        }}
        animate={{ x: [0, 12, -8, 0], y: [0, -10, 6, 0], rotate: [0, 5, -3, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />

      <div className="relative max-w-3xl mx-auto px-4 py-10 z-[2]">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 14 }}
          className="flex items-center gap-2 mb-2"
        >
          <Sparkles size={22} className="text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold text-fg font-[family-name:var(--font-heading)]">
            Frequently Asked Questions
          </h1>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-fg-muted mb-10 text-sm"
        >
          Everything you need to know about Donation.Box
        </motion.p>

        <div className="space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={glassCard + " overflow-hidden transition-all duration-300"}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-semibold text-fg text-sm pr-4 font-[family-name:var(--font-heading)]">
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="shrink-0"
                  >
                    <ChevronDown size={18} className="text-fg-muted" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-sm text-fg-muted leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
