import type { Metadata } from "next";

import { FinalCta } from "@/components/sections/final-cta";
import { Partners } from "@/components/sections/partners";
import { ServicesList } from "@/components/sections/services-list";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Memecoin launches, social media, AI product go-to-market, NFT promotion, community growth, X and Reddit marketing — the full BullShill service list.",
};

export default function ServicesPage() {
  return (
    <>
      <ServicesList />
      <Partners showHeading={false} />
      <FinalCta />
    </>
  );
}
