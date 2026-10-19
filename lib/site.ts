/**
 * The canonical origin, with no trailing slash.
 *
 * Anything that has to print an absolute URL — the sitemap, canonical links,
 * Open Graph images — builds it from here, so staging and production can never
 * disagree about the host.
 */
export const SITE_URL = "https://bullshill.com";
