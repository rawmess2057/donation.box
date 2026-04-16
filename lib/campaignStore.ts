"use client";

export const CREATED_CAMPAIGNS_KEY = "donate_blink_created_campaigns";

export type CampaignDonation = {
  donor: string;
  amount: number;
  signature: string;
  timestamp: number;
};

export type CreatedCampaign = {
  id: string;
  title: string;
  category: string;
  story: string;
  image: string;
  goal: number;
  raised: number;
  progress: number;
  currency: "USDC" | "USD";
  creator: string;
  txSignature: string;
  createdAt: string;
  donations?: CampaignDonation[];
};

export function readCreatedCampaigns(): CreatedCampaign[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(CREATED_CAMPAIGNS_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CreatedCampaign[]) : [];
  } catch {
    return [];
  }
}

export function appendCreatedCampaign(campaign: CreatedCampaign) {
  if (typeof window === "undefined") return;
  const existing = readCreatedCampaigns();
  const updated = [campaign, ...existing];
  window.localStorage.setItem(CREATED_CAMPAIGNS_KEY, JSON.stringify(updated));
}

export function updateCampaignRaised(campaignId: string, addedAmount: number) {
  if (typeof window === "undefined") return;
  const existing = readCreatedCampaigns();
  const updated = existing.map((campaign) => {
    if (campaign.id === campaignId) {
      const newRaised = campaign.raised + addedAmount;
      return {
        ...campaign,
        raised: newRaised,
        progress: Math.min(100, Math.round((newRaised / campaign.goal) * 100)),
      };
    }
    return campaign;
  });
  window.localStorage.setItem(CREATED_CAMPAIGNS_KEY, JSON.stringify(updated));
}

/**
 * Add a donation to a specific campaign
 */
export function addCampaignDonation(
  campaignId: string,
  donation: CampaignDonation
) {
  if (typeof window === "undefined") return;
  const existing = readCreatedCampaigns();
  const updated = existing.map((campaign) => {
    if (campaign.id === campaignId) {
      return {
        ...campaign,
        donations: [donation, ...(campaign.donations || [])],
      };
    }
    return campaign;
  });
  window.localStorage.setItem(CREATED_CAMPAIGNS_KEY, JSON.stringify(updated));
}

/**
 * Get donations for a specific campaign
 */
export function getCampaignDonations(campaignId: string): CampaignDonation[] {
  const campaigns = readCreatedCampaigns();
  const campaign = campaigns.find((c) => c.id === campaignId);
  return campaign?.donations || [];
}
