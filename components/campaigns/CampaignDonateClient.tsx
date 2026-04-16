"use client";

import { useState } from "react";
import { WalletReadyState } from "@solana/wallet-adapter-base";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import DonationPanel from "@/components/campaigns/DonationPanel";
import DonationSuccessScreen from "@/components/campaigns/DonationSuccessScreen";
import { updateCampaignRaised } from "@/lib/campaignStore";

type CampaignDonateClientProps = {
  raised: number;
  goal: number;
  currency: "USDC" | "USD";
  recipientAddress: string;
  campaignId?: string;
  onDonationSuccess?: (amount: number) => void;
};

export default function CampaignDonateClient({
  raised,
  goal,
  currency,
  recipientAddress,
  campaignId,
  onDonationSuccess,
}: CampaignDonateClientProps) {
  const { connection } = useConnection();
  const {
    publicKey,
    select,
    wallets,
    wallet,
    signTransaction,
  } = useWallet();
  const [isProcessing, setIsProcessing] = useState(false);
  const [txError, setTxError] = useState<string>("");
  const [txSignature, setTxSignature] = useState<string>("");
  const [donatedAmount, setDonatedAmount] = useState(0);
  const [donorName, setDonorName] = useState<string>("");
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);

  const selectPreferredWallet = () => {
    const readyStates = new Set<WalletReadyState>([
      WalletReadyState.Installed,
      WalletReadyState.Loadable,
    ]);

    const phantom = wallets.find(
      (walletOption) =>
        walletOption.adapter.name.toLowerCase().includes("phantom") &&
        readyStates.has(walletOption.readyState),
    );
    const backpack = wallets.find(
      (walletOption) =>
        walletOption.adapter.name.toLowerCase().includes("backpack") &&
        readyStates.has(walletOption.readyState),
    );
    const fallbackReadyWallet = wallets.find((walletOption) =>
      readyStates.has(walletOption.readyState),
    );
    const selectedWallet = phantom ?? backpack ?? fallbackReadyWallet;

    if (selectedWallet) {
      select(selectedWallet.adapter.name);
      return selectedWallet;
    }

    return null;
  };

  const sendDonationTransaction = async (
    rpcConnection: Connection,
    payer: PublicKey,
    amount: number,
  ) => {
    if (!recipientAddress) {
      throw new Error(
        "Set NEXT_PUBLIC_DONATION_RECIPIENT with a valid Solana wallet address.",
      );
    }

    const recipient = new PublicKey(recipientAddress);
    const lamports = Math.max(1, Math.round(amount * LAMPORTS_PER_SOL));

    // Get latest blockhash BEFORE creating transaction
    const latestBlockhash = await rpcConnection.getLatestBlockhash();

    const transaction = new Transaction({
      feePayer: payer,
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    }).add(
      SystemProgram.transfer({
        fromPubkey: payer,
        toPubkey: recipient,
        lamports,
      }),
    );

    try {
      if (!signTransaction) {
        throw new Error("Wallet does not support signing transactions.");
      }

      // Sign the transaction using wallet
      const signedTransaction = await signTransaction(transaction);
      console.log("Transaction signed");

      // Send the signed transaction
      const signature = await rpcConnection.sendRawTransaction(
        signedTransaction.serialize()
      );
      console.log("Transaction sent:", signature);
      
      await rpcConnection.confirmTransaction(
        {
          signature,
          blockhash: latestBlockhash.blockhash,
          lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        },
        "confirmed",
      );

      return signature;
    } catch (error) {
      console.error("Transaction error:", error);
      throw error;
    }
  };

  const handleDonate = async (amount: number) => {
    setTxError("");
    setTxSignature("");

    try {
      const selectedWallet = wallet ?? selectPreferredWallet();

      if (!selectedWallet) {
        throw new Error(
          "No compatible wallet is ready. Install Phantom or Backpack and refresh the page.",
        );
      }

      if (!selectedWallet.adapter.connected) {
        try {
          await selectedWallet.adapter.connect();
        } catch (error) {
          if (
            error instanceof Error &&
            /rejected|declined|denied/i.test(error.message)
          ) {
            throw new Error("Wallet connection was cancelled.");
          }
          throw error;
        }
      }

      const payer = selectedWallet.adapter.publicKey ?? publicKey;

      if (!payer) {
        throw new Error("Wallet not connected.");
      }

      // Check wallet balance before attempting transaction
      const balance = await connection.getBalance(payer);
      const lamportsNeeded = Math.max(1, Math.round(amount * LAMPORTS_PER_SOL)) + 5000; // +5000 for fees
      
      if (balance < lamportsNeeded) {
        throw new Error(
          `Insufficient balance. You have ${(balance / LAMPORTS_PER_SOL).toFixed(4)} SOL but need ${(lamportsNeeded / LAMPORTS_PER_SOL).toFixed(4)} SOL.`
        );
      }

      setIsProcessing(true);

      if (currency === "USDC") {
        // TODO: Replace SOL transfer with SPL token transfer for USDC:
        // 1) resolve sender/recipient associated token accounts
        // 2) add createTransferInstruction for USDC mint
        // 3) send + confirm transaction
      }

      const signature = await sendDonationTransaction(
        connection,
        payer,
        amount,
      );
      setTxSignature(signature);
      setDonatedAmount(amount);
      setDonorName(payer.toBase58().slice(0, 8)); // Store first 8 chars of wallet address
      setShowSuccessScreen(true);
      
      // Update campaign raised amount if it's a created campaign
      if (campaignId) {
        updateCampaignRaised(campaignId, amount);
        onDonationSuccess?.(amount);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("Donation error:", errorMessage);
      setTxError(errorMessage || "Failed to submit transaction.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDonateAgain = () => {
    setShowSuccessScreen(false);
    setTxSignature("");
    setDonatedAmount(0);
    setTxError("");
  };

  // Show success modal on top of the component
  return (
    <>
      {showSuccessScreen && txSignature && (
        <DonationSuccessScreen
          donorName={donorName || "Friend"}
          amount={donatedAmount}
          amountInSOL={donatedAmount}
          currency={currency}
          txSignature={txSignature}
          impactMessage="Your donation is making a real difference in people's lives. Thank you for your generosity!"
          onDonateAgain={handleDonateAgain}
          onClose={() => setShowSuccessScreen(false)}
        />
      )}

      <div className="space-y-3">
        <DonationPanel
          raised={raised}
          goal={goal}
          currency={currency}
          onDonate={handleDonate}
        />

        <div className="rounded-xl bg-white/60 p-3 text-xs text-stone-700">
          {isProcessing && (
            <p className="font-medium text-[#1E6E6B]">Processing wallet transaction...</p>
          )}
          {txError && <p className="font-medium text-red-600">{txError}</p>}
          {!isProcessing && !txError && !txSignature && (
            <p>
              Wallet-ready skeleton enabled for Phantom/Backpack. Current transaction
              sends SOL on devnet; replace with SPL flow for USDC.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
