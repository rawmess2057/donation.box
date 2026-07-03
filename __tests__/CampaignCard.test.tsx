import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import CampaignCard from "@/components/campaigns/CampaignCard";
import type { Campaign } from "@/components/campaigns/types";

const mockCampaign: Campaign = {
  id: "test-1",
  title: "Test Campaign",
  subtitle: "Help us make a difference",
  category: "Education",
  image: "/school.png",
  goal: 100,
  raised: 45,
  progress: 45,
  currency: "SOL",
  creator: "ABC123def456",
  txSignature: "sig123",
  createdAt: new Date().toISOString(),
  verified: true,
  donations: [
    { id: "d1", donor: "donor1", amount: 10, timestamp: Date.now() },
  ],
};

describe("CampaignCard", () => {
  it("renders campaign title", () => {
    render(<CampaignCard campaign={mockCampaign} />);
    expect(screen.getByText("Test Campaign")).toBeInTheDocument();
  });

  it("renders campaign subtitle", () => {
    render(<CampaignCard campaign={mockCampaign} />);
    expect(screen.getByText("Help us make a difference")).toBeInTheDocument();
  });

  it("renders category badge", () => {
    render(<CampaignCard campaign={mockCampaign} />);
    expect(screen.getByText("Education")).toBeInTheDocument();
  });

  it("renders SOL raised amount", () => {
    render(<CampaignCard campaign={mockCampaign} />);
    expect(screen.getByText(/SOL raised/)).toBeInTheDocument();
  });

  it("renders donor count", () => {
    render(<CampaignCard campaign={mockCampaign} />);
    expect(screen.getByText("1 donor")).toBeInTheDocument();
  });

  it("renders progress percentage", () => {
    render(<CampaignCard campaign={mockCampaign} />);
    expect(screen.getByText("45%")).toBeInTheDocument();
  });

  it("renders donate now button as link", () => {
    render(<CampaignCard campaign={mockCampaign} />);
    const link = screen.getByText("Donate Now").closest("a");
    expect(link).toHaveAttribute("href", "/campaign/test-1");
  });

  it("renders goal amount", () => {
    render(<CampaignCard campaign={mockCampaign} />);
    expect(screen.getByText(/Goal:/)).toBeInTheDocument();
  });
});
