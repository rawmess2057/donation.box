"use client";

export type FeedItemType = "donation" | "update" | "milestone" | "cnft";

export type FeedItem = {
  id: string;
  type: FeedItemType;
  campaignId: string;
  campaignTitle: string;
  campaignImage?: string;
  creator: string; // Wallet address of campaign creator
  timestamp: number;
  
  // For donations
  donor?: string;
  donationAmount?: number;
  
  // For updates/milestones
  content?: string;
  image?: string;
  video?: string;
  
  // For milestones
  milestone?: string;
  
  // For cNFTs
  cNFTMintId?: string;
  
  // Engagement
  likes?: number;
  comments?: number;
};

const IMPACT_FEED_KEY = "donate_blink_impact_feed";

/**
 * Read all feed items from localStorage
 */
export function readImpactFeed(): FeedItem[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(IMPACT_FEED_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as FeedItem[]) : [];
  } catch {
    return [];
  }
}

/**
 * Add a new feed item (donation, update, milestone, etc.)
 */
export function addFeedItem(item: Omit<FeedItem, "id">) {
  if (typeof window === "undefined") return;
  const existing = readImpactFeed();
  const newItem: FeedItem = {
    ...item,
    id: `feed_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
  };
  const updated = [newItem, ...existing];
  window.localStorage.setItem(IMPACT_FEED_KEY, JSON.stringify(updated));
  return newItem.id;
}

/**
 * Add a donation to the impact feed
 */
export function addDonationToFeed(
  campaignId: string,
  campaignTitle: string,
  campaignImage: string | undefined,
  donor: string,
  amount: number,
  creator: string
) {
  return addFeedItem({
    type: "donation",
    campaignId,
    campaignTitle,
    campaignImage,
    creator,
    donor,
    donationAmount: amount,
    timestamp: Date.now(),
  });
}

/**
 * Add an impact update to the feed
 */
export function addImpactUpdate(
  campaignId: string,
  campaignTitle: string,
  campaignImage: string | undefined,
  creator: string,
  content: string,
  image?: string,
  video?: string
) {
  return addFeedItem({
    type: "update",
    campaignId,
    campaignTitle,
    campaignImage,
    creator,
    content,
    image,
    video,
    timestamp: Date.now(),
  });
}

/**
 * Add a milestone achievement to the feed
 */
export function addMilestone(
  campaignId: string,
  campaignTitle: string,
  campaignImage: string | undefined,
  creator: string,
  milestone: string
) {
  return addFeedItem({
    type: "milestone",
    campaignId,
    campaignTitle,
    campaignImage,
    creator,
    milestone,
    timestamp: Date.now(),
  });
}

/**
 * Add a cNFT proof to the feed
 */
export function addCNFTProof(
  campaignId: string,
  campaignTitle: string,
  campaignImage: string | undefined,
  creator: string,
  cNFTMintId: string,
  content?: string
) {
  return addFeedItem({
    type: "cnft",
    campaignId,
    campaignTitle,
    campaignImage,
    creator,
    cNFTMintId,
    content,
    timestamp: Date.now(),
  });
}

/**
 * Get feed items for a specific campaign
 */
export function getCampaignFeedItems(campaignId: string): FeedItem[] {
  const feed = readImpactFeed();
  return feed.filter((item) => item.campaignId === campaignId);
}

/**
 * Get feed items by type
 */
export function getFeedItemsByType(type: FeedItemType): FeedItem[] {
  const feed = readImpactFeed();
  return feed.filter((item) => item.type === type);
}

/**
 * Get sorted feed (latest first by default)
 */
export function getImpactFeedSorted(
  sortBy: "latest" | "trending" | "topDonations" = "latest"
): FeedItem[] {
  const feed = readImpactFeed();
  
  if (sortBy === "latest") {
    return feed.sort((a, b) => b.timestamp - a.timestamp);
  }
  
  if (sortBy === "topDonations") {
    return feed
      .filter((item) => item.type === "donation")
      .sort((a, b) => (b.donationAmount || 0) - (a.donationAmount || 0));
  }
  
  if (sortBy === "trending") {
    return feed.sort((a, b) => {
      const aScore = (a.likes || 0) + (a.comments || 0) * 2;
      const bScore = (b.likes || 0) + (b.comments || 0) * 2;
      return bScore - aScore;
    });
  }
  
  return feed;
}

/**
 * Update feed item likes
 */
export function likeFeedItem(itemId: string) {
  if (typeof window === "undefined") return;
  const existing = readImpactFeed();
  const updated = existing.map((item) => {
    if (item.id === itemId) {
      return {
        ...item,
        likes: (item.likes || 0) + 1,
      };
    }
    return item;
  });
  window.localStorage.setItem(IMPACT_FEED_KEY, JSON.stringify(updated));
}

/**
 * Add a comment to a feed item (we'll just increment the count for now)
 */
export function addCommentToFeedItem(itemId: string) {
  if (typeof window === "undefined") return;
  const existing = readImpactFeed();
  const updated = existing.map((item) => {
    if (item.id === itemId) {
      return {
        ...item,
        comments: (item.comments || 0) + 1,
      };
    }
    return item;
  });
  window.localStorage.setItem(IMPACT_FEED_KEY, JSON.stringify(updated));
}
