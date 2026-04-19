import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  MOCK_CAMPAIGNS,
  buildFeedItems,
  calculateProgress,
  createId,
  sortFeedItems,
  type CampaignDonation,
  type CampaignRecord,
  type CampaignUpdate,
} from "@/lib/campaigns";

const DATA_DIR = path.join(process.cwd(), "data");
const CAMPAIGNS_FILE = path.join(DATA_DIR, "campaigns.json");

async function ensureCampaignsFile() {
  await mkdir(DATA_DIR, { recursive: true });

  try {
    await readFile(CAMPAIGNS_FILE, "utf8");
  } catch {
    await writeFile(CAMPAIGNS_FILE, "[]\n", "utf8");
  }
}

async function readStoredCampaigns() {
  await ensureCampaignsFile();
  const raw = await readFile(CAMPAIGNS_FILE, "utf8");

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CampaignRecord[]) : [];
  } catch {
    return [];
  }
}

async function writeStoredCampaigns(campaigns: CampaignRecord[]) {
  await ensureCampaignsFile();
  await writeFile(CAMPAIGNS_FILE, `${JSON.stringify(campaigns, null, 2)}\n`, "utf8");
}

export async function getMockCampaigns() {
  const defaultRecipient = process.env.NEXT_PUBLIC_DONATION_RECIPIENT ?? "";
  return MOCK_CAMPAIGNS.map((campaign) => ({
    ...campaign,
    creator: defaultRecipient,
  }));
}

export async function getStoredCampaigns() {
  return readStoredCampaigns();
}

export async function getAllCampaigns() {
  const [stored, mock] = await Promise.all([getStoredCampaigns(), getMockCampaigns()]);
  return [...stored, ...mock].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export async function getCampaignById(id: string) {
  const campaigns = await getAllCampaigns();
  return campaigns.find((campaign) => campaign.id === id) ?? null;
}

export async function createCampaign(
  campaign: Omit<CampaignRecord, "donations" | "updates" | "progress">,
) {
  const stored = await getStoredCampaigns();
  const record: CampaignRecord = {
    ...campaign,
    progress: calculateProgress(campaign.raised, campaign.goal),
    donations: [],
    updates: [],
  };

  stored.unshift(record);
  await writeStoredCampaigns(stored);
  return record;
}

export async function addCampaignDonation(
  campaignId: string,
  donation: Omit<CampaignDonation, "id" | "likes" | "comments">,
) {
  const stored = await getStoredCampaigns();
  let updatedCampaign: CampaignRecord | null = null;

  const updated = stored.map((campaign) => {
    if (campaign.id !== campaignId) {
      return campaign;
    }

    const nextRaised = campaign.raised + donation.amount;
    updatedCampaign = {
      ...campaign,
      raised: nextRaised,
      progress: calculateProgress(nextRaised, campaign.goal),
      donations: [
        {
          ...donation,
          id: createId("donation"),
          likes: 0,
          comments: 0,
        },
        ...campaign.donations,
      ],
    };

    return updatedCampaign;
  });

  if (!updatedCampaign) {
    return null;
  }

  await writeStoredCampaigns(updated);
  return updatedCampaign;
}

export async function addCampaignUpdate(
  campaignId: string,
  update: Omit<CampaignUpdate, "id" | "likes" | "comments" | "timestamp">,
) {
  const stored = await getStoredCampaigns();
  let updatedCampaign: CampaignRecord | null = null;

  const updated = stored.map((campaign) => {
    if (campaign.id !== campaignId) {
      return campaign;
    }

    updatedCampaign = {
      ...campaign,
      updates: [
        {
          ...update,
          id: createId("update"),
          timestamp: Date.now(),
          likes: 0,
          comments: 0,
        },
        ...campaign.updates,
      ],
    };

    return updatedCampaign;
  });

  if (!updatedCampaign) {
    return null;
  }

  await writeStoredCampaigns(updated);
  return updatedCampaign;
}

export async function getFeedItems(sortBy: "latest" | "trending" | "topDonations") {
  const campaigns = await getStoredCampaigns();
  return sortFeedItems(buildFeedItems(campaigns), sortBy);
}

export async function incrementFeedLike(itemId: string) {
  const stored = await getStoredCampaigns();
  let found = false;

  const updated = stored.map((campaign) => {
    const donations = campaign.donations.map((donation) => {
      if (donation.id !== itemId) return donation;
      found = true;
      return {
        ...donation,
        likes: donation.likes + 1,
      };
    });

    const updates = campaign.updates.map((update) => {
      if (update.id !== itemId) return update;
      found = true;
      return {
        ...update,
        likes: update.likes + 1,
      };
    });

    return {
      ...campaign,
      donations,
      updates,
    };
  });

  if (!found) {
    return false;
  }

  await writeStoredCampaigns(updated);
  return true;
}
