/**
 * Resolve the current Solana cluster name from environment or RPC URL.
 * Used to generate correct explorer links across different networks.
 */
export function resolveCluster(): string {
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK;
  if (network === "mainnet-beta" || network === "mainnet") return "mainnet";
  if (network === "testnet") return "testnet";
  // Default to devnet if NEXT_PUBLIC_SOLANA_RPC_URL contains "testnet" or "mainnet"
  const rpc = process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? "";
  if (rpc.includes("testnet")) return "testnet";
  if (rpc.includes("mainnet")) return "mainnet";
  return "devnet";
}

/**
 * Get a Solana Explorer URL for a transaction.
 */
export function getExplorerTxUrl(txSignature: string): string {
  const cluster = resolveCluster();
  return `https://explorer.solana.com/tx/${txSignature}?cluster=${cluster}`;
}

/**
 * Get a descriptive label for the current network (e.g. "Devnet", "Testnet", "Mainnet").
 */
export function getNetworkLabel(): string {
  const cluster = resolveCluster();
  return cluster.charAt(0).toUpperCase() + cluster.slice(1);
}

/**
 * Get a human-readable label for what the app is doing ("creating on Testnet", etc.)
 */
export function getCreateActionLabel(): string {
  const network = getNetworkLabel();
  return `Creating on ${network}...`;
}

/**
 * Get a label for the "created on" section ("Created on Testnet", etc.)
 */
export function getCreatedOnLabel(): string {
  const network = getNetworkLabel();
  return `Created on ${network}`;
}

/**
 * Normalise the configured network to a clusterApiUrl-compatible string.
 */
export function getClusterApiName(): "devnet" | "testnet" | "mainnet-beta" {
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK;
  if (network === "testnet") return "testnet";
  if (network === "mainnet-beta" || network === "mainnet") return "mainnet-beta";
  return "devnet";
}
