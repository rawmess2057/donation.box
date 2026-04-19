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

export type FeedItemType = "donation" | "update";

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

export const MOCK_CAMPAIGNS: CampaignRecord[] = [
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
    createdAt: "2026-04-01T00:00:00.000Z",
    verified: true,
    donations: [],
    updates: [],
  },
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
    createdAt: "2026-04-02T00:00:00.000Z",
    verified: true,
    donations: [],
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
