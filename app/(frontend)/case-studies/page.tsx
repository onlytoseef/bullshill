import type { Metadata } from "next";

import { CaseStudiesHero } from "@/components/sections/case-studies-hero";
import { CaseStudiesList } from "@/components/sections/case-studies-list";
import { Faqs } from "@/components/sections/faqs";
import { FinalCta } from "@/components/sections/final-cta";
import { Partners } from "@/components/sections/partners";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Case Studies",
  description:
    "Crypto marketing case studies from Bullshill — impressions, crypto-native traffic and community growth for token launches and Web3 protocols.",
  path: "/case-studies",
});

export default function CaseStudiesPage() {
  return (
    <>
      <CaseStudiesHero />
      <CaseStudiesList />
      <Partners variant="strip" />
      <Faqs variant="page" />
      <FinalCta variant="page" />
    </>
  );
}
