import type { Metadata } from "next";
import { Geist, Inter } from "next/font/google";

import { NotFoundPage } from "@/components/sections/not-found-page";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: "Page not found | Bullshill",
  description: "This page has moved or does not exist. Explore Bullshill’s services, work and insights.",
  robots: { index: false, follow: true },
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${inter.variable} ${geist.variable}`}>
      <body className="font-sans">
        <main><NotFoundPage /></main>
      </body>
    </html>
  );
}
