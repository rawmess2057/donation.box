"use client";

import { Share2, Home, X } from "lucide-react";

type DonationSuccessScreenProps = {
  donorName?: string;
  amount: number;
  amountInSOL: number;
  currency: "USDC" | "USD";
  txSignature: string;
  impactMessage: string;
  onDonateAgain?: () => void;
  onClose?: () => void;
};

export default function DonationSuccessScreen({
  donorName = "Friend",
  amount,
  amountInSOL,
  currency,
  txSignature,
  impactMessage,
  onDonateAgain,
  onClose,
}: DonationSuccessScreenProps) {
  const handleShare = () => {
    const shareText = `I just donated ${amountInSOL.toFixed(4)} SOL to help: ${impactMessage}. Join me in making an impact! 💚`;
    
    if (navigator.share) {
      navigator.share({
        title: "Heartfelt Thanks",
        text: shareText,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert("Share message copied to clipboard!");
    }
  };

  const mintId = `e627...${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-[#FCF9F1] max-w-4xl w-full rounded-3xl overflow-hidden shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white hover:bg-stone-100 transition"
        >
          <X size={24} className="text-[#97422F]" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          {/* Left Section */}
          <div className="md:col-span-7 p-8 md:p-10 flex flex-col">
            <div className="space-y-2 mb-6">
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#97422F] leading-tight">
                Heartfelt Thanks, {donorName}!
              </h1>
              <p className="text-lg font-medium text-[#55423E]">
                Your kindness radiates warmth across borders.
              </p>
            </div>

            {/* Impact Confirmation Card */}
            <div className="bg-[#F1EEE6] rounded-3xl p-6 relative overflow-hidden shadow-lg mb-6">
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#3A6637] flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-bold text-lg text-[#3A6637]">Impact Confirmed</span>
                </div>

                <p className="font-serif text-xl text-[#1C1C17] leading-relaxed">
                  {impactMessage}
                </p>

                {/* Transaction Details */}
                <div className="pt-4 mt-4 border-t-2 border-[#E5E2DA]/30 space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-[#55423E]">Transaction Hash</span>
                    <a
                      href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#266866] font-bold hover:underline text-xs"
                    >
                      Solana Explorer ↗
                    </a>
                  </div>
                  <div className="flex justify-between items-center bg-[#EBE8E0] rounded-xl p-3">
                    <span className="font-bold text-[#1C1C17] text-sm">Donation of {amountInSOL.toFixed(4)} {currency}</span>
                    <span className="text-xs text-[#55423E] font-mono">
                      {txSignature.slice(0, 4)}...{txSignature.slice(-4)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-auto">
              <button
                onClick={handleShare}
                className="flex-1 bg-gradient-to-tr from-[#97422F] to-[#B65945] text-white font-bold py-4 px-6 rounded-full shadow-lg hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Share2 size={18} />
                Share
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-[#266866]/10 text-[#266866] font-bold py-4 px-6 rounded-full hover:bg-[#266866]/20 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Home size={18} />
                Close
              </button>
              {onDonateAgain && (
                <button
                  onClick={onDonateAgain}
                  className="flex-1 bg-[#3A6637] text-white font-bold py-4 px-6 rounded-full hover:bg-[#2E5229] transition-all active:scale-95"
                >
                  💚 Donate Again
                </button>
              )}
            </div>
          </div>

          {/* Right Section - Premium cNFT Card */}
          <div className="md:col-span-5 bg-white p-6 flex items-center justify-center relative">
            <div className="w-full">
              {/* Verified Badge */}
              <div className="absolute top-6 right-6 z-10">
                <div className="w-10 h-10 rounded-full bg-[#BDF0B4] flex items-center justify-center text-[#002203]">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col space-y-4">
                <div className="space-y-3">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#FFDAD3] text-[#7C2D1C] text-xs font-bold uppercase tracking-widest">
                    Digital cNFT Reward
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#1C1C17]">
                    The Hearth Keeper
                  </h3>
                  <p className="text-sm text-[#55423E] font-medium leading-relaxed">
                    Limited Edition Impact Badge #{Math.floor(Math.random() * 10000)}. Unique digital collectible minted on Solana for the Donation Mission.
                  </p>
                </div>

                {/* NFT Image Placeholder */}
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-[#97422F]/30 to-[#266866]/30">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-5xl mb-2">🔥</div>
                      <div className="text-xs font-bold text-[#55423E]">Impact Proof</div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end text-xs">
                    <div className="text-white">
                      <p className="uppercase font-bold tracking-tighter opacity-80 text-[9px]">Owner</p>
                      <p className="font-bold">{donorName}</p>
                    </div>
                    <div className="text-white text-right">
                      <p className="uppercase font-bold tracking-tighter opacity-80 text-[9px]">Date</p>
                      <p className="font-bold">Oct 2024</p>
                    </div>
                  </div>
                </div>

                {/* Mint ID */}
                <div className="flex items-center gap-2 text-xs font-bold text-[#55423E]/70 pt-2 border-t border-[#E5E2DA]">
                  <span>💎</span>
                  <span className="truncate">MINT_ID: {mintId}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
