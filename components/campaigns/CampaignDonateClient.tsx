"use client";

import { useState } from "react";
import { WalletReadyState } from "@solana/wallet-adapter-base";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  SendTransactionError,
} from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import DonationPanel from "@/components/campaigns/DonationPanel";
import DonationSuccessScreen from "@/components/campaigns/DonationSuccessScreen";
import { updateCampaignRaised, addCampaignDonation } from "@/lib/campaignStore";

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
    retryCount: number = 0,
  ): Promise<string> => {
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
        signedTransaction.serialize(),
        { skipPreflight: false } // Let it fail early if invalid
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
      
      // Handle SendTransactionError specifically
      if (error instanceof SendTransactionError) {
        const logs = error.getLogs ? error.getLogs() : [];
        console.error("Transaction logs:", logs);
        
        // Check if this is an "already processed" error
        if (error.message && error.message.includes("already been processed")) {
          console.warn("Transaction was already processed. This is likely a duplicate submission.");
          // If we haven't retried yet, get a fresh blockhash and try once more
          if (retryCount < 1) {
            console.log("Retrying with fresh blockhash...");
            await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms before retry
            return sendDonationTransaction(rpcConnection, payer, amount, retryCount + 1);
          }
          // If we've already retried, throw a specific error
          throw new Error("TRANSACTION_ALREADY_PROCESSED");
        }
      }
      
      throw error;
    }
  };

  const handleDonate = async (amount: number) => {
    // Prevent multiple simultaneous submissions
    if (isProcessing) {
      console.warn("Donation already in progress");
      return;
    }

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
      const donationLamports = Math.max(1, Math.round(amount * LAMPORTS_PER_SOL));
      // Add generous buffer for compute budget instructions (~0.0001 SOL) + base fees
      const feeBuffer = 100000; // ~0.0001 SOL for compute budget + transaction fees
      const lamportsNeeded = donationLamports + feeBuffer;
      
      if (balance < lamportsNeeded) {
        throw new Error(
          `Insufficient balance. You have ${(balance / LAMPORTS_PER_SOL).toFixed(4)} SOL but need at least ${(lamportsNeeded / LAMPORTS_PER_SOL).toFixed(4)} SOL.`
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
        // Store donation details for the campaign
        addCampaignDonation(campaignId, {
          donor: payer.toBase58(),
          amount,
          signature,
          timestamp: Date.now(),
        });
        onDonationSuccess?.(amount);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // Handle specific error cases
      if (errorMessage === "TRANSACTION_ALREADY_PROCESSED") {
        setTxError("Your previous donation might have gone through. Check your wallet or try again in a moment.");
      } else if (errorMessage.includes("User rejected")) {
        setTxError("Wallet transaction was cancelled.");
      } else if (errorMessage.includes("Insufficient balance")) {
        setTxError(errorMessage);
      } else if (errorMessage.includes("insufficient lamports")) {
        setTxError("Your wallet doesn't have enough SOL for this donation. Please add funds and try again.");
      } else if (errorMessage.includes("already been processed")) {
        setTxError("Donation already processed. Thank you for your support!");
      } else if (errorMessage.includes("Simulation failed")) {
        setTxError("Transaction simulation failed. Your wallet may not have sufficient balance for this donation amount.");
      } else {
        console.error("Donation error:", errorMessage);
        setTxError(errorMessage || "Failed to submit transaction.");
      }
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
          currency="SOL"
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
          isProcessing={isProcessing}
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
