import { renderOgImage } from "@/lib/og-card";

/**
 * Literal, not imported: Next reads image-route config by static analysis at
 * build time, and an imported binding fails that check with "Invalid segment
 * configuration export detected" — a dev-only warning that is a hard build
 * error in production.
 */
export const alt =
  "Bullshill — Marketing Built for Web3 Success. Crypto and AI marketing agency.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Twitter/X reads `twitter:image` first; same card, same generator. */
export default function TwitterImage() {
  return renderOgImage();
}
