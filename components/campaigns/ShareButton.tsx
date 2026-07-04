"use client";

import { useMemo, useState } from "react";
import { Share2, Copy, CheckCircle, Link2, QrCode, Send } from "lucide-react";
import {
  generateBlinkUrl,
  generateQRCodeUrl,
  copyToClipboard,
} from "@/lib/blinkGenerator";

interface ShareButtonProps {
  campaignId: string;
  campaignTitle?: string;
}

export default function ShareButton({
  campaignId,
  campaignTitle = "Campaign",
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const blinkUrl = useMemo(() => generateBlinkUrl(campaignId), [campaignId]);

  const handleCopyBlink = async () => {
    try {
      await copyToClipboard(blinkUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const handleShareTwitter = () => {
    const text = `I'm supporting "${campaignTitle}" on Donation.Box — transparent crowdfunding on Solana!\n\n${blinkUrl}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "width=550,height=420");
  };

  const qrCodeUrl = generateQRCodeUrl(blinkUrl);

  return (
    <div className="relative">
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="flex items-center gap-2 rounded-xl bg-white/[0.04] backdrop-blur-2xl border border-white/20 text-accent px-4 py-2.5 font-semibold transition-all duration-500 ease-out active:scale-95 shadow-[0_0_15px_rgba(3,225,255,0.1)] hover:shadow-[0_0_40px_rgba(3,225,255,0.25)] hover:border-accent/50 hover:text-white hover:bg-accent/15"
        title="Share this campaign"
      >
        <Share2 size={18} />
        <span className="hidden sm:inline">Share</span>
      </button>

      {showOptions && (
        <>
          <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-white/10 bg-gradient-to-br from-primary/[0.04] via-transparent to-accent/[0.02] backdrop-blur-2xl shadow-xl z-50 overflow-hidden">
            <div className="border-b border-white/10 px-4 py-3">
              <h3 className="font-semibold text-fg">Share Campaign</h3>
              <p className="text-xs text-fg-muted mt-1">
                Share via Solana Blinks or social media
              </p>
            </div>

            <div className="p-3 space-y-1">
              <button
                onClick={handleCopyBlink}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-bg-muted transition text-left"
              >
                <div className="shrink-0">
                  {copied ? (
                    <CheckCircle size={20} className="text-success" />
                  ) : (
                    <Copy size={20} className="text-accent" />
                  )}
                </div>
                <div className="grow min-w-0">
                  <p className="text-sm font-medium text-fg">
                    {copied ? "Copied!" : "Copy Blink Link"}
                  </p>
                  <p className="text-xs text-fg-subtle truncate">Share on social media — opens Blink in Phantom &amp; Backpack</p>
                </div>
              </button>

              <button
                onClick={() => setShowQR(!showQR)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition text-left"
              >
                <QrCode size={20} className="text-accent shrink-0" />
                <div>
                  <p className="text-sm font-medium text-fg">
                    {showQR ? "Hide QR Code" : "Show QR Code"}
                  </p>
                  <p className="text-xs text-fg-subtle">Scan to donate via mobile</p>
                </div>
              </button>

              <button
                onClick={handleShareTwitter}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-950/40 transition text-left"
              >
                <Send size={20} className="text-blue-500 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-fg">Share on Twitter</p>
                  <p className="text-xs text-fg-subtle">Post to your timeline</p>
                </div>
              </button>

              <a
                href={`/campaign/${campaignId}`}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition text-left"
              >
                <Link2 size={20} className="text-accent shrink-0" />
                <div>
                  <p className="text-sm font-medium text-fg">Campaign Page</p>
                  <p className="text-xs text-fg-subtle">Direct link to details</p>
                </div>
              </a>
            </div>

            {showQR && (
              <div className="border-t border-white/10 p-4">
                <p className="text-xs font-semibold text-fg-muted mb-3 uppercase tracking-wide">
                  Scan with Phantom or Backpack
                </p>
                <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-xl p-3 flex justify-center">
                  <img src={qrCodeUrl} alt="Campaign Blink QR Code" className="w-40 h-40" />
                </div>
              </div>
            )}

            <div className="border-t border-white/10 px-4 py-2 bg-white/[0.04] backdrop-blur-xl">
              <p className="text-xs text-fg-muted">
                Blinks work best with Phantom and Backpack mobile wallets
              </p>
            </div>
          </div>

          <div className="fixed inset-0 z-40" onClick={() => setShowOptions(false)} />
        </>
      )}
    </div>
  );
}
