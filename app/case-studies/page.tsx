import type { Metadata } from "next";

import { CaseStudiesHero } from "@/components/sections/case-studies-hero";
import { CaseStudiesList } from "@/components/sections/case-studies-list";
import { Faqs } from "@/components/sections/faqs";
import { FinalCta } from "@/components/sections/final-cta";
import { Partners } from "@/components/sections/partners";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Crypto marketing case studies from BullShill — impressions, crypto-native traffic and community growth for token launches and Web3 protocols.",
};

export default function CaseStudiesPage() {
  return (
    <>
      <CaseStudiesHero />
      <CaseStudiesList />
      <Partners showHeading={false} />
      <Faqs />
      <FinalCta />
    </>
  );
}
