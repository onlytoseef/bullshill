import { OG_ALT, renderOgImage } from "@/lib/og-card";

export const alt = OG_ALT;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Inherited by every route, so each page gets `og:image` without repeating it.
 * File-based metadata outranks anything set in a page's `metadata` export.
 */
export default function OpengraphImage() {
  return renderOgImage();
}
