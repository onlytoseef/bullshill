import type { Metadata } from "next";

export const SITE_NAME = "Bullshill";

type Params = {
  /** Page title. Templated with the site name unless `absolute`. */
  title: string;
  description: string;
  /** Route path, e.g. "/services". Resolved against `metadataBase`. */
  path: string;
  /** Skip the "%s | Bullshill" template — the home page uses this. */
  absolute?: boolean;
};

/**
 * One page's metadata.
 *
 * `openGraph` is spelled out in full on purpose: Next replaces a nested object
 * wholesale rather than merging it with the parent segment, so a page that only
 * set `openGraph.title` would drop `siteName`, `locale` and the rest. Keeping it
 * in one helper is what stops that from quietly happening per page.
 *
 * The canonical is relative — `metadataBase` in the root layout turns it into an
 * absolute URL, so staging and production can never disagree about the host.
 */
export function pageMetadata({
  title,
  description,
  path,
  absolute = false,
}: Params): Metadata {
  return {
    title: absolute ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_US",
      url: path,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
