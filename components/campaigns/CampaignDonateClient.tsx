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

type CampaignDonateClientProps = {
  raised: number;
  goal: number;
  currency: "USDC" | "USD";
  recipientAddress: string;
};

export default function CampaignDonateClient({
  raised,
  goal,
  currency,
  recipientAddress,
}: CampaignDonateClientProps) {
  const { connection } = useConnection();
  const {
    publicKey,
    select,
    wallets,
    wallet,
  } = useWallet();
  const [isProcessing, setIsProcessing] = useState(false);
  const [txError, setTxError] = useState<string>("");
  const [txSignature, setTxSignature] = useState<string>("");

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
    walletAdapter: (typeof wallets)[number]["adapter"],
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

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: payer,
        toPubkey: recipient,
        lamports,
      }),
    );

    const signature = await walletAdapter.sendTransaction(transaction, rpcConnection);
    const latestBlockhash = await rpcConnection.getLatestBlockhash();
    await rpcConnection.confirmTransaction(
      {
        signature,
        ...latestBlockhash,
      },
      "confirmed",
    );

    return signature;
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

      setIsProcessing(true);

      if (currency === "USDC") {
        // TODO: Replace SOL transfer with SPL token transfer for USDC:
        // 1) resolve sender/recipient associated token accounts
        // 2) add createTransferInstruction for USDC mint
        // 3) send + confirm transaction
      }

      const signature = await sendDonationTransaction(
        connection,
        selectedWallet.adapter,
        payer,
        amount,
      );
      setTxSignature(signature);
    } catch (error) {
      setTxError(
        error instanceof Error ? error.message : "Failed to submit transaction.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
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
        {txSignature && (
          <p>
            Donation submitted:{" "}
            <a
              href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-[#1E6E6B] underline"
            >
              View transaction
            </a>
          </p>
        )}
        {!isProcessing && !txError && !txSignature && (
          <p>
            Wallet-ready skeleton enabled for Phantom/Backpack. Current transaction
            sends SOL on devnet; replace with SPL flow for USDC.
          </p>
        )}
      </div>
    </div>
  );
}
