import type { Metadata } from "next";
import { Geist, Inter } from "next/font/google";

import { ContactBubble } from "@/components/layout/contact-bubble";
import { PageLoader } from "@/components/layout/page-loader";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { MotionProviders } from "@/components/motion/providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
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
