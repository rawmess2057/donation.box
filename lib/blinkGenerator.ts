/**
 * Blink URL Generator
 * Utility functions to generate shareable Solana Action URLs for campaign donations
 */

/**
 * Generate a Blink Action URL for a campaign
 * @param campaignId - The campaign ID to generate the link for
 * @param baseUrl - Optional base URL (defaults to current domain)
 * @returns The full Blink Action URL
 */
export function generateBlinkUrl(campaignId: string, baseUrl?: string): string {
  const base = baseUrl || (typeof window !== "undefined" ? window.location.origin : "");
  if (!base) {
    throw new Error("Cannot determine base URL - please provide baseUrl parameter");
  }
  return `${base}/api/actions/donate?campaignId=${encodeURIComponent(campaignId)}`;
}

/**
 * Generate a web campaign link (for fallback/social sharing)
 * @param campaignId - The campaign ID
 * @param baseUrl - Optional base URL
 * @returns The campaign detail page URL
 */
export function generateCampaignUrl(campaignId: string, baseUrl?: string): string {
  const base = baseUrl || (typeof window !== "undefined" ? window.location.origin : "");
  if (!base) {
    throw new Error("Cannot determine base URL - please provide baseUrl parameter");
  }
  return `${base}/campaign/${encodeURIComponent(campaignId)}`;
}

/**
 * Generate a shareable link object with both Blink and web URLs
 * @param campaignId - The campaign ID
 * @param campaignTitle - Optional campaign title for social media
 * @param baseUrl - Optional base URL
 * @returns Object with blink and web URLs
 */
export function generateShareLinks(
  campaignId: string,
  campaignTitle?: string,
  baseUrl?: string
) {
  const blinkUrl = generateBlinkUrl(campaignId, baseUrl);
  const webUrl = generateCampaignUrl(campaignId, baseUrl);

  return {
    blink: blinkUrl,
    web: webUrl,
    // Social media share URLs
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      `I'm supporting "${campaignTitle || "a campaign"}" on Donate.Box - help make a difference!`
    )}&url=${encodeURIComponent(webUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(webUrl)}`,
  };
}

/**
 * Copy text to clipboard
 * @param text - Text to copy
 * @returns Promise that resolves when copied
 */
export async function copyToClipboard(text: string): Promise<void> {
  if (!navigator.clipboard) {
    // Fallback for older browsers
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    return;
  }

  await navigator.clipboard.writeText(text);
}

/**
 * Generate a QR code URL (using external service)
 * @param url - URL to encode in QR code
 * @param size - Size in pixels (default 300)
 * @returns QR code image URL
 */
export function generateQRCodeUrl(url: string, size: number = 300): string {
  // Using qr-server.com free API (no key required)
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}`;
}
