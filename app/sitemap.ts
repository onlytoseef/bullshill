import type { MetadataRoute } from "next";

import { getPublishedPostEntries } from "@/lib/cms/posts";
import { caseStudiesPage, servicesPage } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

/**
 * /sitemap.xml, built from the same content the pages render, so a new post or
 * case study cannot be missed here.
 *
 * Blog entries now come from the CMS and cover **published posts only** — a
 * draft is never listed, and unpublishing removes it on the next revalidation.
 * A database that is unreachable yields an empty blog section rather than a
 * failed sitemap.
 *
 * `lastModified` is only given where the content carries a real date. A
 * build-time `new Date()` would mark every URL as changed on every deploy,
 * which teaches crawlers to ignore the field. `priority` and `changeFrequency`
 * are deliberately absent: Google has said for years that it ignores both.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  const posts = (await getPublishedPostEntries()).map((post) => {
    const entry: MetadataRoute.Sitemap[number] = page(`/blog/${post.slug}`);
    if (post.updatedAt) {
      const date = new Date(post.updatedAt);
      if (!Number.isNaN(date.getTime())) entry.lastModified = date;
    }
    return entry;
  });

  return [...staticRoutes, ...services, ...caseStudies, ...posts];
}
