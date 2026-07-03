import * as nacl from "tweetnacl";
import { PublicKey } from "@solana/web3.js";
import { decode as bs58Decode } from "bs58";

export function verifyAdminSignature(
  signature: string,
  message: string,
): boolean {
  const adminWallet = process.env.ADMIN_WALLET;
  if (!adminWallet) {
    return false;
  }

  try {
    const publicKey = new PublicKey(adminWallet);
    const messageBytes = new TextEncoder().encode(message);
    const signatureBytes = bs58Decode(signature);

    return nacl.sign.detached.verify(
      messageBytes,
      signatureBytes,
      publicKey.toBytes(),
    );
  } catch {
    return false;
  }
}

export function buildAdminMessage(
  action: string,
  body: unknown,
  timestamp: number,
): string {
  return `admin:${action}:${JSON.stringify(body)}:${timestamp}`;
}
