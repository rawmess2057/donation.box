"use client";

export const CREATED_CAMPAIGNS_KEY = "donate_blink_created_campaigns";

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
