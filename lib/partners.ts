export type PartnerOrgType = "NGO" | "INGO";

export type Partner = {
  wallet: string;
  orgName: string;
  type: PartnerOrgType;
  description: string;
  logoUrl: string;
  website: string;
  approvedAt: string;
};
