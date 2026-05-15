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

type CampaignDonateClientProps = {
  raised: number;
  goal: number;
  currency: "SOL";
  recipientAddress: string;
  campaignId?: string;
  campaignTitle?: string;
  campaignImage?: string;
  campaignCreator?: string;
  onDonationSuccess?: (amount: number) => void;
};

export default function CampaignDonateClient({
  raised,
  goal,
  currency,
  recipientAddress,
  campaignId,
  campaignTitle = "Campaign",
  campaignImage,
  campaignCreator,
  onDonationSuccess,
}: CampaignDonateClientProps) {
  const { connection } = useConnection();
  const { publicKey, select, wallets, wallet, signTransaction } = useWallet();
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
    retryCount = 0,
  ): Promise<string> => {
    const finalRecipientAddress = campaignCreator || recipientAddress;

    if (!finalRecipientAddress) {
      throw new Error("A valid Solana recipient address is required.");
    }

    const recipient = new PublicKey(finalRecipientAddress);
    const lamports = Math.max(1, Math.round(amount * LAMPORTS_PER_SOL));
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

      const signedTransaction = await signTransaction(transaction);
      const signature = await rpcConnection.sendRawTransaction(
        signedTransaction.serialize(),
        { skipPreflight: false },
      );

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
      if (
        error instanceof SendTransactionError &&
        error.message.includes("already been processed")
      ) {
        if (retryCount < 1) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          return sendDonationTransaction(rpcConnection, payer, amount, retryCount + 1);
        }
        throw new Error("TRANSACTION_ALREADY_PROCESSED");
      }

      throw error;
    }
  };

  const handleDonate = async (amount: number) => {
    if (isProcessing) {
      return;
    }

    setTxError("");
    setTxSignature("");
    setIsProcessing(true);

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

      const balance = await connection.getBalance(payer);
      const donationLamports = Math.max(1, Math.round(amount * LAMPORTS_PER_SOL));
      const feeBuffer = 100000;
      const lamportsNeeded = donationLamports + feeBuffer;

      if (balance < lamportsNeeded) {
        throw new Error(
          `Insufficient balance. You have ${(balance / LAMPORTS_PER_SOL).toFixed(4)} SOL but need at least ${(lamportsNeeded / LAMPORTS_PER_SOL).toFixed(4)} SOL.`,
        );
      }

      const signature = await sendDonationTransaction(connection, payer, amount);

      if (campaignId) {
        const response = await fetch(`/api/campaigns/${campaignId}/donations`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            donor: payer.toBase58(),
            amount,
            signature,
            timestamp: Date.now(),
            campaignTitle,
            campaignImage,
            campaignCreator,
          }),
        });

        if (!response.ok) {
          throw new Error("Donation was sent on devnet, but updating the campaign failed.");
        }
      }

      setTxSignature(signature);
      setDonatedAmount(amount);
      setDonorName(payer.toBase58().slice(0, 8));
      setShowSuccessScreen(true);
      onDonationSuccess?.(amount);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);

      if (errorMessage === "TRANSACTION_ALREADY_PROCESSED") {
        setTxError(
          "Your previous donation might have gone through. Check your wallet or try again in a moment.",
        );
      } else if (
        errorMessage.includes("User rejected") ||
        errorMessage.includes("cancelled")
      ) {
        setTxError("Wallet transaction was cancelled.");
      } else if (errorMessage.includes("Insufficient balance")) {
        setTxError(errorMessage);
      } else if (errorMessage.includes("insufficient lamports")) {
        setTxError(
          "Your wallet doesn't have enough SOL for this donation. Please add funds and try again.",
        );
      } else if (errorMessage.includes("Simulation failed")) {
        setTxError(
          "Transaction simulation failed. Your wallet may not have sufficient balance for this donation amount.",
        );
      } else {
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

  return (
    <>
      {showSuccessScreen && txSignature && (
        <DonationSuccessScreen
          donorName={donorName || "Friend"}
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
        {txError && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {txError}
          </p>
        )}
      </div>
    </>
  );
}
