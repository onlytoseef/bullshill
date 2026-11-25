import type { MetadataRoute } from "next";
import { connection } from "next/server";

import { getCachedSitemap } from "@/lib/sitemap";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Do not query Payload while building the image. Unlike force-dynamic,
  // connection() leaves the explicit Data Cache below available at runtime.
  await connection();
  return getCachedSitemap();
}
