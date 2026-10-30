import type { Metadata } from "next";

import { FinalCta } from "@/components/sections/final-cta";
import { Partners } from "@/components/sections/partners";
import { ServicesList } from "@/components/sections/services-list";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Services",
  description:
    "Memecoin launches, social media, AI product go-to-market, NFT promotion, community growth, X and Reddit marketing — the full Bullshill service list.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <ServicesList />
      <Partners variant="strip" />
      <FinalCta variant="page" />
    </>
  );
}
