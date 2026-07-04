"use client";

import { motion, type Variants } from "framer-motion";
import {
  Share2,
  MessageCircle,
  Camera,
  Globe,
  Heart,
  Mail,
} from "lucide-react";
import Button from "@/components/ui/Button";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const stepVariants: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 100, damping: 14 },
  },
};

const iconVariants: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 12 },
  },
};

const glassCard =
  "backdrop-blur-2xl border border-white/10 rounded-2xl";

const glassIcon =
  "bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-full";

interface SocialIcon {
  Icon: typeof Share2;
  x: string;
  y: string;
  delay: number;
}

const socialIcons: SocialIcon[] = [
  { Icon: Share2, x: "8%", y: "8%", delay: 0 },
  { Icon: MessageCircle, x: "72%", y: "4%", delay: 0.3 },
  { Icon: Camera, x: "78%", y: "38%", delay: 0.6 },
  { Icon: Globe, x: "6%", y: "52%", delay: 0.9 },
  { Icon: Heart, x: "12%", y: "30%", delay: 1.2 },
  { Icon: Mail, x: "68%", y: "62%", delay: 1.5 },
];

const steps = [
  {
    number: 1,
    title: "Create your campaign",
    description:
      "Tell your story, set a funding goal, and add media to bring your cause to life.",
    link: { text: "Start a campaign \u2192", href: "/create" },
  },
  {
    number: 2,
    title: "Reach donors by sharing",
    description:
      "Share your campaign link on social media, via email, or embed it on your website.",
  },
  {
    number: 3,
    title: "Securely receive funds",
    description:
      "Donations arrive directly in your Solana wallet \u2014 instantly, globally, with minimal fees.",
  },
];

function FloatingIcon({ Icon, x, y, delay }: SocialIcon) {
  return (
    <motion.div
      className={`absolute ${glassIcon} w-12 h-12 flex items-center justify-center`}
      style={{ left: x, top: y }}
      variants={iconVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      whileHover={{ scale: 1.15, borderColor: "rgba(127,191,127,0.4)" }}
      animate={{
        y: [0, -8, 0],
        opacity: [0.7, 1, 0.7],
      }}
      transition={{
        y: {
          duration: 3 + delay,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay * 0.3,
        },
        opacity: {
          duration: 2 + delay,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay * 0.3,
        },
      }}
    >
      <Icon className="w-5 h-5 text-primary opacity-70" />
    </motion.div>
  );
}

export default function HowItWorksSection() {
  return (
    <section className="relative px-4 py-20 overflow-hidden">
      {/* Solana background shapes */}
      <motion.div
        className="absolute top-[5%] left-[2%] w-[140px] h-[140px] pointer-events-none z-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(127,191,127,0.12), rgba(127,191,127,0.03))",
          clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
        }}
        animate={{ x: [0, 12, -8, 0], y: [0, -8, 6, 0], rotate: [0, 8, -4, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[8%] right-[1%] w-[160px] h-[140px] pointer-events-none z-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(3,225,255,0.08), rgba(3,225,255,0.02))",
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
        }}
        animate={{ x: [0, -10, 5, 0], y: [0, -15, 8, 0], rotate: [0, -3, 2, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
      <motion.div
        className="absolute top-[45%] left-[3%] w-[200px] h-[40px] pointer-events-none z-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(220,31,255,0.08), rgba(220,31,255,0.02))",
          clipPath: "polygon(0% 0%, 70% 0%, 100% 100%, 30% 100%)",
        }}
        animate={{ x: [0, 20, -10, 0], scale: [1, 1.08, 0.95, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />
      <motion.div
        className="absolute bottom-[10%] right-[0%] w-[180px] h-[150px] pointer-events-none z-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(127,191,127,0.06), rgba(3,225,255,0.03))",
          clipPath: "polygon(0% 0%, 100% 0%, 50% 100%)",
        }}
        animate={{ x: [0, -15, 8, 0], y: [0, 12, -6, 0], rotate: [0, 5, -3, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div
        className="absolute bottom-[0%] left-[-5%] w-[260px] h-[260px] pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle, rgba(220,31,255,0.06) 0%, rgba(3,225,255,0.02) 60%, transparent 100%)",
          clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
        }}
        animate={{ scale: [1, 1.08, 0.95, 1], rotate: [0, 6, -3, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      />

      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-b from-transparent to-bg pointer-events-none z-[1]" />

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-[2]">
        {/* Left: Share Card */}
        <motion.div
          className={`relative ${glassCard} p-8           lg:min-h-[560px] flex flex-col items-center justify-center`}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Phone mockup */}
          <motion.div
            className={`w-48 h-72 ${glassCard} p-4 flex flex-col gap-3 relative z-10`}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  type: "spring",
                  stiffness: 100,
                  damping: 14,
                  delay: 0.2,
                },
              },
            }}
          >
            <div className="w-3/4 h-2.5 rounded-full bg-white/10" />
            <div className="w-1/2 h-2.5 rounded-full bg-white/10" />
            <div className="w-full h-24 rounded-xl bg-primary/10 mt-2" />
            <div className="w-5/6 h-2.5 rounded-full bg-white/10" />
            <div className="w-2/3 h-2.5 rounded-full bg-white/10" />
            <div className="w-3/4 h-2.5 rounded-full bg-white/10 mt-auto" />
            <div className="w-full h-9 rounded-xl bg-primary/15 flex items-center justify-center">
              <span className="text-[10px] text-primary font-semibold tracking-wider uppercase">
                Share
              </span>
            </div>
          </motion.div>

          {/* Floating social icons */}
          {socialIcons.map((s) => (
            <FloatingIcon key={s.delay} {...s} />
          ))}

          {/* Bottom CTA */}
          <motion.div
            className="mt-auto pt-6 relative z-10"
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  delay: 0.8,
                  type: "spring",
                  stiffness: 100,
                  damping: 14,
                },
              },
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Button variant="secondary" size="md">
              <Share2 className="w-4 h-4" />
              Ready to share
            </Button>
          </motion.div>
        </motion.div>

        {/* Right: Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight font-[family-name:var(--font-heading)] mb-12"
            variants={{
              hidden: { opacity: 0, y: -10 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  type: "spring",
                  stiffness: 100,
                  damping: 14,
                },
              },
            }}
          >
            Fundraising on{" "}
            <span
              className="bg-gradient-to-r from-primary via-accent to-success bg-clip-text text-transparent animate-shimmer"
              style={{ backgroundSize: "200% 100%" }}
            >
              Donation.Box
            </span>
            <br />
            is easy, powerful & trusted
          </motion.h2>

          <div className="space-y-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                className="flex gap-5"
                variants={stepVariants}
              >
                <div className="shrink-0 w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                  <span className="text-primary font-bold text-lg">
                    {String(step.number).padStart(2, "0")}
                  </span>
                </div>
                <div className="pt-1">
                  <h3 className="text-lg font-semibold text-fg">
                    {step.title}
                  </h3>
                  <p className="text-fg-muted mt-1 text-sm leading-relaxed">
                    {step.description}
                  </p>
                  {step.link && (
                    <a
                      href={step.link.href}
                      className="inline-block mt-2 text-sm font-semibold text-accent hover:text-accent-hover transition-colors duration-300"
                    >
                      {step.link.text}
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
