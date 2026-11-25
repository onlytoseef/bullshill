import type { MetadataRoute } from "next";
import { unstable_cache } from "next/cache";

import { getPublishedPostEntries } from "@/lib/cms/posts";
import { caseStudiesPage, servicesPage } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

/**
 * /sitemap.xml, built from the same content the pages render, so a new post or
 * case study cannot be missed here.
 *
 * Blog entries now come from the CMS and cover **published posts only** — a
 * draft is never listed, and unpublishing removes it on the next revalidation.
 * An unavailable database throws instead of caching an incomplete sitemap.
 * Only successful generations enter the Data Cache. Time-based or soft-tag
 * revalidation can keep serving the previous value if PostgreSQL is unavailable.
 *
 * `lastModified` is only given where the content carries a real date. A
 * build-time `new Date()` would mark every URL as changed on every deploy,
 * which teaches crawlers to ignore the field. `priority` and `changeFrequency`
 * are deliberately absent: Google has said for years that it ignores both.
 */
export async function generateSitemap(): Promise<MetadataRoute.Sitemap> {
  const startedAt = Date.now();
  const page = (path: string): MetadataRoute.Sitemap[number] => ({
    url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
  });

  const staticRoutes = [
    "/",
    "/services",
    "/case-studies",
    "/blog",
    "/testimonials",
    "/contact",
    "/privacy-policy",
    "/terms",
  ].map(page);

  const services = servicesPage.items.map((service) =>
    page(`/services/${service.slug}`),
  );

  const caseStudies = caseStudiesPage.items.map((study) =>
    page(`/case-studies/${study.slug}`),
  );

  let publishedPosts: Awaited<ReturnType<typeof getPublishedPostEntries>>;
  try {
    publishedPosts = await getPublishedPostEntries();
  } catch (error) {
    console.error(JSON.stringify({
      event: "sitemap.generation_failed", timestamp: new Date().toISOString(),
      staticCount: staticRoutes.length + services.length + caseStudies.length,
      blogCount: null, totalUrlCount: null, durationMs: Date.now() - startedAt,
      errorName: error instanceof Error ? error.name : "UnknownError",
      reason: error instanceof Error ? error.message : "Sitemap read failed",
    }));
    throw error;
  }
  const posts = publishedPosts.map((post) => {
    const entry: MetadataRoute.Sitemap[number] = page(`/blog/${post.slug}`);
    if (post.updatedAt) {
      const date = new Date(post.updatedAt);
      if (!Number.isNaN(date.getTime())) entry.lastModified = date;
    }
    return entry;
  });

  const entries = [...staticRoutes, ...services, ...caseStudies, ...posts];
  console.info(JSON.stringify({
    event: "sitemap.generated", timestamp: new Date().toISOString(),
    staticCount: staticRoutes.length + services.length + caseStudies.length,
    blogCount: posts.length, totalUrlCount: entries.length,
    durationMs: Date.now() - startedAt,
  }));
  return entries;
}

// Kept separate from the request gate: the cache function must not call
// connection(). The route invokes it only after an incoming HTTP request.
export const getCachedSitemap = unstable_cache(generateSitemap, ["sitemap-v2"], {
  revalidate: 300,
  tags: ["sitemap"],
});
