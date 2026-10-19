import type { MetadataRoute } from "next";

import { blogPosts, caseStudiesPage, servicesPage } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

/**
 * /sitemap.xml, built from the same content the pages render, so a new post or
 * case study cannot be missed here.
 *
 * `lastModified` is only given where the content carries a real date. A
 * build-time `new Date()` would mark every URL as changed on every deploy,
 * which teaches crawlers to ignore the field. The pages with no date of their
 * own simply leave it out — the sitemap protocol treats it as optional, and a
 * wrong date is worse than none.
 *
 * `priority` and `changeFrequency` are deliberately absent: Google has said for
 * years that it ignores both.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const page = (path: string): MetadataRoute.Sitemap[number] => ({
    url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
  });

  /** "August 15, 2025" → a Date, or `undefined` if it does not parse. */
  const asDate = (value: string) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? undefined : date;
  };

  const staticRoutes = [
    "/",
    "/services",
    "/case-studies",
    "/blog",
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

  const posts = blogPosts.map((post) => ({
    ...page(`/blog/${post.slug}`),
    lastModified: asDate(post.date),
  }));

  return [...staticRoutes, ...services, ...caseStudies, ...posts];
}
