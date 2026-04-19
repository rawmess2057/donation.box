import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

export type RecentDonation = {
  donor: string;
  amount: number;
  signature: string;
  timestamp: number;
};

const RPC_ENDPOINT = "https://api.devnet.solana.com";
const RATE_LIMIT_DELAY = 200; // ms between requests
const CACHE_DURATION = 30000; // Cache for 30 seconds
const STORAGE_KEY = "donate_blink_recent_donations";

// Simple in-memory cache
let donationCache: {
  data: RecentDonation[];
  timestamp: number;
} | null = null;

function isRateLimitError(error: unknown): error is { message?: string; code?: number } {
  return (
    typeof error === "object" &&
    error !== null &&
    ("message" in error || "code" in error)
  );
}

/**
 * Save donations to localStorage for offline support
 */
function saveDonationsToStorage(donations: RecentDonation[]) {
  try {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(donations));
    }
  } catch (error) {
    console.warn("Failed to save donations to storage:", error);
  }
}

/**
 * Load donations from localStorage fallback
 */
function getDonationsFromStorage(): RecentDonation[] {
  try {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    }
  } catch (error) {
    console.warn("Failed to load donations from storage:", error);
  }
  return [];
}

/**
 * Fetch recent donations to a recipient address from devnet
 * @param recipientAddress - The wallet address receiving donations
 * @param limit - Maximum number of transactions to fetch (default: 5)
 * @returns Array of recent donations
 */
export async function fetchRecentDonations(
  recipientAddress: string,
  limit: number = 5
): Promise<RecentDonation[]> {
  try {
    // Check cache first
    if (donationCache && Date.now() - donationCache.timestamp < CACHE_DURATION) {
      console.log("Returning cached donations");
      return donationCache.data;
    }

    const connection = new Connection(RPC_ENDPOINT, "confirmed");
    const recipientPubkey = new PublicKey(recipientAddress);

    // Fetch signatures for transactions to this address (reduced limit to avoid rate limits)
    console.log("Fetching signatures...");
    const signatures = await connection.getSignaturesForAddress(
      recipientPubkey,
      { limit: Math.min(limit, 5) } // Max 5 to avoid rate limiting
    );

    if (signatures.length === 0) {
      console.log("No signatures found");
      const stored = getDonationsFromStorage();
      return stored;
    }

    const donations: RecentDonation[] = [];

    // Parse each transaction with delays to avoid rate limiting
    for (let i = 0; i < signatures.length; i++) {
      const { signature, blockTime } = signatures[i];
      
      // Add delay between requests
      if (i > 0) {
        await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
      }

      try {
        console.log(`Fetching transaction ${i + 1}/${signatures.length}: ${signature.slice(0, 10)}...`);
        
        const transaction = await connection.getTransaction(signature, {
          maxSupportedTransactionVersion: 0,
        });

        if (!transaction || !transaction.meta || !transaction.transaction.message) {
          continue;
        }

        // Look for SOL transfers in the transaction
        const postBalances = transaction.meta.postBalances || [];
        const preBalances = transaction.meta.preBalances || [];
        const accountKeys = transaction.transaction.message.getAccountKeys();
        const accounts = accountKeys.keySegments().flat();

        if (preBalances.length === 0 || postBalances.length === 0 || accounts.length === 0) {
          continue;
        }

        // Find the recipient account index
        const recipientIndex = accounts.findIndex(
          (account) => account.toBase58() === recipientAddress
        );

        if (recipientIndex === -1) continue;

        // Calculate balance change for the recipient
        const preBalance = preBalances[recipientIndex] || 0;
        const postBalance = postBalances[recipientIndex] || 0;
        const balanceChange = postBalance - preBalance;

        // If recipient's balance increased, it's a donation
        if (balanceChange > 0) {
          // The donor is typically the first account (feePayer)
          const donor = accounts[0];
          if (donor) {
            const lamportsDonated = balanceChange;
            const solDonated = lamportsDonated / LAMPORTS_PER_SOL;

            // Only include significant donations (> 0.01 SOL)
            if (solDonated > 0.01) {
              donations.push({
                donor: donor.toBase58(),
                amount: solDonated,
                signature,
                timestamp: blockTime || 0,
              });
              console.log(`Found donation: ${solDonated.toFixed(4)} SOL`);
            }
          }
        }
      } catch (error: unknown) {
        // Handle rate limit errors gracefully
        if (
          isRateLimitError(error) &&
          ((typeof error.message === "string" && error.message.includes("429")) ||
            error.code === 429)
        ) {
          console.warn(`Rate limited. Stopping fetch and using cached data.`);
          // Return cached/stored donations instead of crashing
          const stored = getDonationsFromStorage();
          if (stored.length > 0) return stored;
          break;
        }
        console.warn(`Failed to parse transaction`);
        continue;
      }
    }

    // Sort by timestamp descending (most recent first)
    const sorted = donations.sort((a, b) => b.timestamp - a.timestamp);
    
    // Update cache and storage
    donationCache = {
      data: sorted,
      timestamp: Date.now(),
    };
    saveDonationsToStorage(sorted);

    return sorted;
  } catch (error: unknown) {
    console.error(
      "Error fetching donations:",
      isRateLimitError(error) && typeof error.message === "string"
        ? error.message
        : error,
    );
    // Return stored donations as fallback
    return getDonationsFromStorage();
  }
}

/**
 * Format donation amount for display
 * @param amount - Amount in SOL
 * @returns Formatted string
 */
export function formatDonationAmount(amount: number): string {
  return amount.toFixed(4);
}

/**
 * Truncate wallet address for display
 * @param address - Full wallet address
 * @returns Truncated address
 */
export function truncateAddress(address: string): string {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}
