import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ContactBubble } from "@/components/layout/contact-bubble";
import { PageLoader } from "@/components/layout/page-loader";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { MotionProviders } from "@/components/motion/providers";
import "./globals.css";

// Variable font, so no `weight` — the whole 400–700 range the design system
// uses comes from one file.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "BullShill — Marketing Built for Web3 Success",
    template: "%s | BullShill",
  },
  description:
    "Data-driven, end-to-end marketing for crypto and Web3 projects. Token launches, community building, and campaigns that convert.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} antialiased`}
      // Next 16 no longer forces scroll-behavior during navigation; this opts
      // back into the old smooth behaviour for route changes.
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
