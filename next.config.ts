import type { NextConfig } from "next";

import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
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
  },
};

export default withPayload(nextConfig);
