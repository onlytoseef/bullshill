import { OG_ALT, renderOgImage } from "@/lib/og-card";

export const alt = OG_ALT;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Twitter/X reads `twitter:image` first; same card, same generator. */
export default function TwitterImage() {
  return renderOgImage();
}
