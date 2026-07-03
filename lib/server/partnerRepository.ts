import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Partner } from "@/lib/partners";

const DATA_DIR = path.join(process.cwd(), "data");
const PARTNERS_FILE = path.join(DATA_DIR, "partners.json");

async function ensurePartnersFile() {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    await readFile(PARTNERS_FILE, "utf8");
  } catch {
    await writeFile(PARTNERS_FILE, "[]\n", "utf8");
  }
}

async function readPartners(): Promise<Partner[]> {
  await ensurePartnersFile();
  const raw = await readFile(PARTNERS_FILE, "utf8");
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Partner[]) : [];
  } catch {
    return [];
  }
}

async function writePartners(partners: Partner[]) {
  await ensurePartnersFile();
  await writeFile(PARTNERS_FILE, `${JSON.stringify(partners, null, 2)}\n`, "utf8");
}

export async function getAllPartners(): Promise<Partner[]> {
  return readPartners();
}

export async function getPartnerByWallet(wallet: string): Promise<Partner | null> {
  const partners = await readPartners();
  return partners.find((p) => p.wallet === wallet) ?? null;
}

export async function isPartnerWallet(wallet: string): Promise<boolean> {
  const partner = await getPartnerByWallet(wallet);
  return partner !== null;
}

export async function addPartner(partner: Partner): Promise<Partner> {
  const partners = await readPartners();
  const existing = partners.findIndex((p) => p.wallet === partner.wallet);
  if (existing !== -1) {
    partners[existing] = partner;
  } else {
    partners.push(partner);
  }
  await writePartners(partners);
  return partner;
}

export async function removePartner(wallet: string): Promise<boolean> {
  const partners = await readPartners();
  const filtered = partners.filter((p) => p.wallet !== wallet);
  if (filtered.length === partners.length) return false;
  await writePartners(filtered);
  return true;
}
