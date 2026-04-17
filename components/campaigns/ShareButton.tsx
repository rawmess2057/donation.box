"use client";

import { useState, useEffect } from "react";
import {
  Share2,
  Copy,
  CheckCircle,
  Link2,
  QrCode,
  Send,
} from "lucide-react";
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
  const [blinkUrl, setBlinkUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    try {
      const url = generateBlinkUrl(campaignId);
      setBlinkUrl(url);
    } catch (err) {
      console.error("Error generating Blink URL:", err);
    }
  }, [campaignId]);

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
    const text = `I'm supporting "${campaignTitle}" on Donate.Box - help rebuild Nepal's communities with Solana! 🌍\n\n${blinkUrl}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "width=550,height=420");
  };

  const qrCodeUrl = generateQRCodeUrl(blinkUrl);

  return (
    <div className="relative">
      {/* Main Share Button */}
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="flex items-center gap-2 rounded-lg bg-[#2D7774] px-4 py-2 font-medium text-white transition hover:bg-[#1f5a57] active:scale-95"
        title="Share this campaign"
      >
        <Share2 size={18} />
        <span className="hidden sm:inline">Share</span>
      </button>

      {/* Options Menu */}
      {showOptions && (
        <div className="absolute right-0 top-full mt-2 w-72 rounded-lg border border-stone-200 bg-white shadow-lg z-50">
          {/* Header */}
          <div className="border-b border-stone-200 px-4 py-3">
            <h3 className="font-semibold text-stone-900">Share Campaign</h3>
            <p className="text-xs text-stone-500 mt-1">
              Share your campaign with supporters using Solana Blinks or social media
            </p>
          </div>

          {/* Options */}
          <div className="p-3 space-y-2">
            {/* Copy Blink Link */}
            <button
              onClick={handleCopyBlink}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-stone-50 transition text-left"
            >
              <div className="shrink-0">
                {copied ? (
                  <CheckCircle size={20} className="text-green-600" />
                ) : (
                  <Copy size={20} className="text-[#2D7774]" />
                )}
              </div>
              <div className="grow min-w-0">
                <p className="text-sm font-medium text-stone-900">
                  {copied ? "Copied!" : "Copy Blink Link"}
                </p>
                <p className="text-xs text-stone-500 truncate">{blinkUrl}</p>
              </div>
            </button>

            {/* Show QR Code */}
            <button
              onClick={() => setShowQR(!showQR)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-stone-50 transition text-left"
            >
              <QrCode size={20} className="text-[#2D7774] shrink-0" />
              <div>
                <p className="text-sm font-medium text-stone-900">
                  {showQR ? "Hide QR Code" : "Show QR Code"}
                </p>
                <p className="text-xs text-stone-500">
                  Scan to share via mobile
                </p>
              </div>
            </button>

            {/* Share to Twitter */}
            <button
              onClick={handleShareTwitter}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 transition text-left"
            >
              <Send size={20} className="text-blue-500 shrink-0" />
              <div>
                <p className="text-sm font-medium text-stone-900">
                  Share on Twitter
                </p>
                <p className="text-xs text-stone-500">
                  Post this campaign to your timeline
                </p>
              </div>
            </button>

            {/* Campaign Link */}
            <a
              href={`/campaign/${campaignId}`}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-stone-50 transition text-left"
            >
              <Link2 size={20} className="text-[#2D7774] shrink-0" />
              <div>
                <p className="text-sm font-medium text-stone-900">
                  Campaign Page
                </p>
                <p className="text-xs text-stone-500">
                  Direct link to campaign details
                </p>
              </div>
            </a>
          </div>

          {/* QR Code Section */}
          {showQR && (
            <div className="border-t border-stone-200 p-4">
              <p className="text-xs font-semibold text-stone-600 mb-3">
                SCAN WITH PHANTOM OR BACKPACK
              </p>
              <div className="bg-white p-3 rounded-lg border border-stone-200 flex justify-center">
                <img
                  src={qrCodeUrl}
                  alt="Campaign Blink QR Code"
                  className="w-40 h-40"
                />
              </div>
              <p className="text-xs text-stone-500 mt-2 text-center">
                Mobile wallets supporting Blinks can scan this code to donate
              </p>
            </div>
          )}

          {/* Footer Message */}
          <div className="border-t border-stone-200 px-4 py-2 bg-stone-50 rounded-b-lg">
            <p className="text-xs text-stone-600">
              💡 <strong>Tip:</strong> Blinks work best with Phantom and Backpack mobile wallets
            </p>
          </div>
        </div>
      )}

      {/* Close overlay when clicking outside */}
      {showOptions && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowOptions(false)}
        />
      )}
    </div>
  );
}
