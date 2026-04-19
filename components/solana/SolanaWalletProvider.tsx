"use client";

import { useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { BackpackWalletAdapter } from "@solana/wallet-adapter-backpack";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";

type SolanaWalletProviderProps = {
  children: React.ReactNode;
};

export default function SolanaWalletProvider({
  children,
}: SolanaWalletProviderProps) {
  const endpoint =
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? "https://api.devnet.solana.com";

  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new BackpackWalletAdapter()],
    [],
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets}>
        {children}
      </WalletProvider>
    </ConnectionProvider>
  );
}
