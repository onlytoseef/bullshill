import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

/**
 * /robots.txt — everything here is public and meant to be indexed, so there is
 * nothing to disallow. The sitemap line is the part that actually matters: it
 * is how a crawler finds the routes that are not linked from the nav.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
