"use client";

import { motion } from "framer-motion";
import { Calendar, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

const glassCard =
  "bg-gradient-to-br from-primary/[0.04] via-transparent to-accent/[0.02] backdrop-blur-2xl border border-white/10 rounded-2xl";

const POSTS = [
  {
    title: "Introducing Donation.Box — Transparent Crowdfunding on Solana",
    date: "June 28, 2026",
    excerpt: "We&apos;re building the first fully non-custodial crowdfunding platform where donations flow directly from donor to creator. No middleman, no hidden fees.",
    category: "Announcement",
    href: "#",
  },
  {
    title: "How Solana Blinks are Changing Online Fundraising",
    date: "June 22, 2026",
    excerpt: "Solana Blinks let anyone donate directly from their wallet with a single tap. Learn how this technology makes giving faster and more accessible.",
    category: "Technology",
    href: "#",
  },
  {
    title: "Partner Spotlight: Meet the NGOs Using Donation.Box",
    date: "June 15, 2026",
    excerpt: "We&apos;re proud to partner with organizations making a real difference. Read their stories and see how blockchain transparency helps build trust.",
    category: "Community",
    href: "#",
  },
  {
    title: "A Creator&apos;s Guide to Running a Successful Campaign",
    date: "June 8, 2026",
    excerpt: "Tips and best practices for setting up your campaign, engaging donors, and sharing impact updates that resonate with your community.",
    category: "Guide",
    href: "#",
  },
  {
    title: "Security First: How Donation.Box Protects Your Donations",
    date: "June 1, 2026",
    excerpt: "Every transaction is verified on the Solana blockchain. We never custody funds, and our smart contract architecture ensures complete transparency.",
    category: "Security",
    href: "#",
  },
  {
    title: "The Future of Philanthropy: On-Chain Impact Tracking",
    date: "May 25, 2026",
    excerpt: "Impact updates with proof photos and on-chain verification give donors unprecedented visibility into how their contributions are used.",
    category: "Technology",
    href: "#",
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-bg relative overflow-hidden">
      <motion.div
        className="absolute top-[5%] right-[1%] w-[180px] h-[70px] pointer-events-none z-0"
        style={{
          background: "linear-gradient(135deg, rgba(127,191,127,0.1), rgba(127,191,127,0.03))",
          clipPath: "polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)",
        }}
        animate={{ x: [0, -15, 10, 0], rotate: [0, 3, -2, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[10%] left-[1%] w-[160px] h-[160px] pointer-events-none z-0"
        style={{
          background: "linear-gradient(135deg, rgba(3,225,255,0.07), rgba(220,31,255,0.03))",
          clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
        }}
        animate={{ x: [0, 12, -8, 0], y: [0, -10, 6, 0], rotate: [0, 5, -3, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />

      <div className="relative max-w-5xl mx-auto px-4 py-10 z-[2]">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 14 }}
          className="flex items-center gap-2 mb-2"
        >
          <Sparkles size={22} className="text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold text-fg font-[family-name:var(--font-heading)]">
            Blog
          </h1>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-fg-muted mb-10 text-sm"
        >
          Updates, guides, and stories from the Donation.Box community
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {POSTS.map((post, i) => (
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
              className={glassCard + " p-5 group transition-all duration-500 ease-out hover:shadow-[0_0_30px_rgba(127,191,127,0.1)]"}
            >
              <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3 bg-primary/15 text-primary border border-primary/30">
                {post.category}
              </span>
              <div className="flex items-center gap-1.5 text-[11px] text-fg-muted mb-2">
                <Calendar size={12} />
                {post.date}
              </div>
              <h2 className="font-bold text-fg text-sm leading-snug mb-2 font-[family-name:var(--font-heading)]">
                {post.title}
              </h2>
              <p className="text-xs text-fg-muted leading-relaxed mb-4">
                {post.excerpt}
              </p>
              {post.href !== "#" ? (
                <Link
                  href={post.href}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent-hover transition-colors"
                >
                  Read More <ArrowRight size={12} />
                </Link>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-fg-subtle">
                  Coming soon <ArrowRight size={12} />
                </span>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </main>
  );
}
