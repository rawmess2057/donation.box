"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import type { Campaign } from "@/components/campaigns/types";

type Props = {
  trending: Campaign[];
  latest: Campaign[];
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 100, damping: 14 },
  },
};

const glassCard =
  "bg-gradient-to-br from-primary/[0.15] via-transparent to-accent/[0.1] backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden";

export default function CampaignShowcaseGrid({ trending, latest }: Props) {
  const featured = trending[0];
  const gridCampaigns = [
    ...trending.slice(1, 3),
    ...latest.slice(0, 2),
  ].filter(
    (c, i, arr) => arr.findIndex((x) => x.id === c.id) === i
  ).slice(0, 4);

  if (!featured) return null;

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="mb-10 flex items-end justify-between">
          <h2 className="text-3xl font-bold text-fg font-[family-name:var(--font-heading)]">
            Featured Campaigns
          </h2>
          <Link
            href="/explore"
            className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:text-accent-hover transition-colors duration-300"
          >
            View all
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {/* Left: Featured campaign */}
          <motion.div variants={cardVariants} className="group bg-gradient-to-br from-primary/[0.15] via-transparent to-accent/[0.1] rounded-3xl overflow-hidden">
            <Link href={`/campaign/${featured.id}`}>
              <div className="relative">
                <Image
                  src={featured.image}
                  alt={featured.title}
                  width={800}
                  height={600}
                  className="w-full h-full object-cover aspect-[4/3] transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white text-sm px-4 py-1 rounded-full tabular-nums">
                  {featured.donations.length > 0
                    ? `${featured.donations.length.toLocaleString()} donor${featured.donations.length !== 1 ? "s" : ""}`
                    : "0 donors"}
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <h3 className="text-xl font-semibold text-fg leading-snug line-clamp-2 font-[family-name:var(--font-heading)]">
                  {featured.title}
                </h3>

                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-success animate-river-flow"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${Math.min(100, featured.progress)}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    role="progressbar"
                    aria-valuenow={featured.raised}
                    aria-valuemin={0}
                    aria-valuemax={featured.goal}
                  />
                </div>

                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-fg tabular-nums">
                    {featured.raised.toLocaleString(undefined, {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 2,
                    })}{" "}
                    SOL raised
                  </span>
                  <span className="text-fg-subtle">
                    of{" "}
                    {featured.goal.toLocaleString(undefined, {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 2,
                    })}{" "}
                    SOL
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Right: 2x2 grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={containerVariants}
          >
            {gridCampaigns.map((campaign, i) => {
              const progress = Math.min(100, campaign.progress);
              return (
                <motion.div
                  key={campaign.id}
                  variants={cardVariants}
                  whileHover={{ y: -4 }}
                  className={`${glassCard} group`}
                >
                  <Link href={`/campaign/${campaign.id}`}>
                    <div className="relative">
                      <Image
                        src={campaign.image}
                        alt={campaign.title}
                        width={400}
                        height={250}
                        className="w-full h-44 object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                      <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full tabular-nums">
                        {campaign.donations.length > 0
                          ? `${campaign.donations.length.toLocaleString()} donor${campaign.donations.length !== 1 ? "s" : ""}`
                          : "0 donors"}
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                      <h4 className="font-semibold text-fg leading-snug line-clamp-2 font-[family-name:var(--font-heading)]">
                        {campaign.title}
                      </h4>

                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-success animate-river-flow"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${progress}%` }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 1,
                            delay: 0.2 + i * 0.1,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          role="progressbar"
                          aria-valuenow={campaign.raised}
                          aria-valuemin={0}
                          aria-valuemax={campaign.goal}
                        />
                      </div>

                      <span className="block text-sm font-medium text-fg-muted tabular-nums">
                        {campaign.raised.toLocaleString(undefined, {
                          minimumFractionDigits: 1,
                          maximumFractionDigits: 2,
                        })}{" "}
                        SOL raised
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
