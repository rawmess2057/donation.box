export type CampaignCurrency = "SOL";

export type CampaignDonation = {
  id: string;
  donor: string;
  amount: number;
  signature: string;
  timestamp: number;
  likes: number;
  comments: number;
};

export type CampaignUpdate = {
  id: string;
  content: string;
  image?: string;
  video?: string;
  timestamp: number;
  likes: number;
  comments: number;
};

export type CampaignRecord = {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  story: string;
  image: string;
  goal: number;
  raised: number;
  progress: number;
  currency: CampaignCurrency;
  creator: string;
  txSignature: string;
  createdAt: string;
  verified: boolean;
  donations: CampaignDonation[];
  updates: CampaignUpdate[];
};

export type FeedItemType = "donation" | "update" | "milestone" | "cnft";

export type FeedItem = {
  id: string;
  type: FeedItemType;
  campaignId: string;
  campaignTitle: string;
  campaignImage?: string;
  creator: string;
  timestamp: number;
  donor?: string;
  donationAmount?: number;
  content?: string;
  image?: string;
  video?: string;
  milestone?: string;
  cNFTMintId?: string;
  likes: number;
  comments: number;
};

export function calculateProgress(raised: number, goal: number) {
  if (goal <= 0) return 0;
  return Math.min(100, Math.round((raised / goal) * 100));
}

export function createId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Sort campaigns by trending score.
 * Trending considers:
 *   - Number of recent donations (weighted by recency)
 *   - Total raised so far
 *   - Progress percentage (momentum)
 *   - Number of campaign updates
 */
export function sortCampaignsByTrending(campaigns: CampaignRecord[]): CampaignRecord[] {
  const now = Date.now();
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

  return [...campaigns].sort((a, b) => {
    const scoreA = calculateTrendingScore(a, now, SEVEN_DAYS_MS);
    const scoreB = calculateTrendingScore(b, now, SEVEN_DAYS_MS);
    return scoreB - scoreA;
  });
}

function calculateTrendingScore(
  campaign: CampaignRecord,
  now: number,
  windowMs: number,
): number {
  let score = 0;

  // Raised amount (weighted heavily — money raised signals trust)
  score += campaign.raised * 10;

  // Progress momentum (% funded, capped at 100%)
  score += campaign.progress * 2;

  // Recent donation activity — each donation in the last 7 days counts
  const recentDonations = campaign.donations.filter(
    (d) => now - d.timestamp < windowMs,
  );
  score += recentDonations.length * 15;

  // Recency bonus — donations within last 24 hours get extra weight
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const veryRecentDonations = recentDonations.filter(
    (d) => now - d.timestamp < ONE_DAY_MS,
  );
  score += veryRecentDonations.length * 25;

  // Updates show engagement
  score += campaign.updates.length * 10;

  // Total unique donors (spread matters)
  score += new Set(campaign.donations.map((d) => d.donor)).size * 5;

  // Age bonus — newer campaigns get a small boost to help them surface
  const ageMs = now - new Date(campaign.createdAt).getTime();
  if (ageMs < windowMs) {
    score += 10; // Boost campaigns created in the last week
  }

  return score;
}

/**
 * Sort campaigns by latest (newest first).
 */
export function sortCampaignsByLatest(campaigns: CampaignRecord[]): CampaignRecord[] {
  return [...campaigns].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export const MOCK_CAMPAIGNS: CampaignRecord[] = [
  {
    id: "2",
    title: "Landslide Relief - Gorkha District",
    subtitle: "Emergency shelter and food kits for displaced families.",
    category: "Emergency",
    story:
      "Local responders are coordinating short-term housing, water, and food support for families impacted by landslides in high-risk areas.",
    image: "/landslide.png",
    goal: 12,
    raised: 8.4,
    progress: calculateProgress(8.4, 12),
    currency: "SOL",
    creator: "",
    txSignature: "mock-campaign-2",
    createdAt: "2026-04-05T00:00:00.000Z",
    verified: true,
    donations: [
      {
        id: "d1",
        donor: "DonorA",
        amount: 2.0,
        signature: "sig-d1",
        timestamp: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
        likes: 3,
        comments: 1,
      },
      {
        id: "d2",
        donor: "DonorB",
        amount: 1.5,
        signature: "sig-d2",
        timestamp: Date.now() - 12 * 60 * 60 * 1000, // 12 hours ago
        likes: 1,
        comments: 0,
      },
    ],
    updates: [
      {
        id: "u1",
        content:
          "We've distributed emergency kits to 45 families this week. Thank you for your support!",
        timestamp: Date.now() - 24 * 60 * 60 * 1000,
        likes: 8,
        comments: 2,
      },
    ],
  },
  {
    id: "1",
    title: "Help rebuild classrooms destroyed by landslide",
    subtitle: "Support safer learning spaces for students in Sindhupalchok.",
    category: "Education",
    story:
      "Community volunteers are rebuilding damaged classrooms and replacing basic materials so children can return to school quickly.",
    image: "/school.png",
    goal: 8,
    raised: 3.2,
    progress: calculateProgress(3.2, 8),
    currency: "SOL",
    creator: "",
    txSignature: "mock-campaign-1",
    createdAt: "2026-04-10T00:00:00.000Z",
    verified: true,
    donations: [
      {
        id: "d3",
        donor: "DonorC",
        amount: 0.8,
        signature: "sig-d3",
        timestamp: Date.now() - 6 * 60 * 60 * 1000, // 6 hours ago
        likes: 2,
        comments: 0,
      },
    ],
    updates: [],
  },
  {
    id: "3",
    title: "Nutrition for 85 kids in Kathmandu communities",
    subtitle: "Help fund recurring nutrition packs for children in need.",
    category: "Nutrition",
    story:
      "This campaign supports a local nutrition initiative delivering recurring meal support and essential health supplies to children.",
    image: "/nutrition.png",
    goal: 5,
    raised: 1.2,
    progress: calculateProgress(1.2, 5),
    currency: "SOL",
    creator: "",
    txSignature: "mock-campaign-3",
    createdAt: "2026-04-03T00:00:00.000Z",
    verified: true,
    donations: [],
    updates: [],
  },
];

export function buildFeedItems(campaigns: CampaignRecord[]): FeedItem[] {
  return campaigns.flatMap((campaign) => {
    const donationItems = campaign.donations.map((donation) => ({
      id: donation.id,
      type: "donation" as const,
      campaignId: campaign.id,
      campaignTitle: campaign.title,
      campaignImage: campaign.image,
      creator: campaign.creator,
      timestamp: donation.timestamp,
      donor: donation.donor,
      donationAmount: donation.amount,
      likes: donation.likes,
      comments: donation.comments,
    }));

    const updateItems = campaign.updates.map((update) => ({
      id: update.id,
      type: "update" as const,
      campaignId: campaign.id,
      campaignTitle: campaign.title,
      campaignImage: campaign.image,
      creator: campaign.creator,
      timestamp: update.timestamp,
      content: update.content,
      image: update.image,
      video: update.video,
      likes: update.likes,
      comments: update.comments,
    }));

    return [...donationItems, ...updateItems];
  });
}

export function sortFeedItems(
  items: FeedItem[],
  sortBy: "latest" | "trending" | "topDonations" = "latest",
) {
  const copied = [...items];

  if (sortBy === "topDonations") {
    return copied
      .filter((item) => item.type === "donation")
      .sort((a, b) => (b.donationAmount ?? 0) - (a.donationAmount ?? 0));
  }

  if (sortBy === "trending") {
    return copied.sort((a, b) => {
      const aScore = a.likes + a.comments * 2;
      const bScore = b.likes + b.comments * 2;
      return bScore - aScore;
    });
  }

  return copied.sort((a, b) => b.timestamp - a.timestamp);
}
