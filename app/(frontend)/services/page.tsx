import type { Metadata } from "next";
import { PageJsonLd } from "@/components/seo/page-json-ld";
import { servicesPage } from "@/lib/content";

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
      <PageJsonLd path="/services" name="Services" type="CollectionPage" description={metadata.description ?? undefined} items={servicesPage.items.map((service) => ({ name: service.title, path: `/services/${service.slug}` }))} />
      <ServicesList />
      <Partners variant="strip" />
      <FinalCta variant="page" />
    </>
  );
}
