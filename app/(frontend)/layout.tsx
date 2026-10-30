import type { Metadata } from "next";
import { Geist, Inter } from "next/font/google";
import type { ReactNode } from "react";

import { ContactBubble } from "@/components/layout/contact-bubble";
import { PageLoader } from "@/components/layout/page-loader";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { MotionProviders } from "@/components/motion/providers";
import { SITE_NAME } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const DESCRIPTION =
  "Data-driven, end-to-end marketing for crypto and Web3 projects. Token launches, community building, and campaigns that convert.";

export const metadata: Metadata = {
  /**
   * Resolves every relative URL in metadata — the per-page canonicals, the
   * Open Graph `url`, the generated social image — against the real origin.
   * Without it Next can only emit relative paths.
   */
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Bullshill — Marketing Built for Web3 Success",
    template: "%s | Bullshill",
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  // Fallbacks only: every page supplies its own complete `openGraph` through
  // `pageMetadata`, since Next replaces the object rather than merging it.
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    title: "Bullshill — Marketing Built for Web3 Success",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Bullshill — Marketing Built for Web3 Success",
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

/**
 * The site's root layout. It lives inside the `(frontend)` route group so the
 * Payload admin — which needs its own `<html>`/`<body>` — does not inherit the
 * marketing chrome, the Lenis smooth scroll or the three.js backdrops.
 *
 * The route group adds no URL segment: every path on the site is unchanged.
 */
export default function FrontendLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geist.variable} antialiased`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-dvh font-sans">
        <MotionProviders>
          <PageLoader />
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
          <ContactBubble />
        </MotionProviders>
      </body>
    </html>
  );
}
