import type { NextConfig } from "next";

import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  experimental: {
    globalNotFound: true,
  },
  /**
   * Lets a phone on the same Wi-Fi open the dev server at this machine's LAN
   * address. `next dev` blocks its dev resources for any host but localhost —
   * including the live-reload socket the page waits on before React hydrates,
   * so without this a phone gets the server HTML with no JavaScript running:
   * no animations, no menu, no tabs. Dev-only; production builds ignore it.
   * Update it if `next dev` prints a different "Network:" address.
   */
  allowedDevOrigins: ["192.168.100.5"],

  images: {
    /**
     * WebP only. AVIF compresses ~20% smaller but encodes ~50% slower on the
     * first request and doubles the optimizer's cache footprint, since each
     * format is cached separately.
     */
    formats: ["image/webp"],
    /**
     * Next 16 turned this into a required allowlist: a `quality` outside it is
     * silently coerced to the nearest allowed value. 75 is what the Image
     * component asks for by default. The source files are already encoded
     * (photos q82, logos q85), so a second expensive pass buys nothing.
     */
    qualities: [75],
    /**
     * Optimised image responses are content-hashed (the URL carries `?...&w=…`
     * of an immutable source), so they can be cached for a year. The default is
     * 60s, which re-runs the optimiser on every repeat visit — slower LCP.
     */
    minimumCacheTTL: 60 * 60 * 24 * 365,
    /**
     * `next/image` refuses a `?` in a local source unless an entry matches.
     * Next's default is `{ search: "" }`, which allows none. Uploads carry a
     * `?v=<updatedAt>` cache-buster (see `lib/cms/media.ts`), so that one path
     * has to accept a query — the entry deliberately omits `search`, since the
     * matcher compares it exactly rather than as a glob. Every other local
     * image keeps the default no-query rule.
     */
    localPatterns: [
      { pathname: "/api/media/**" },
      { pathname: "**", search: "" },
    ],
  },
  /**
   * Long-lived caching for the immutable build output. Hashed bundles and
   * static assets never change under the same URL, so repeat visits skip a
   * round-trip. No markup or layout is affected.
   */
  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/assets/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=2592000" },
        ],
      },
    ];
  },
};

export default withPayload(nextConfig);
