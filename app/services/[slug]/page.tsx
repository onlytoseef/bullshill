import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Partners } from "@/components/sections/partners";
import { ServiceDetail } from "@/components/sections/service-detail";
import { servicesPage } from "@/lib/content";

type Props = {
  params: Promise<{ slug: string }>;
};

const findIndex = (slug: string) =>
  servicesPage.items.findIndex((service) => service.slug === slug);

export function generateStaticParams() {
  return servicesPage.items.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = servicesPage.items[findIndex(slug)];
  if (!service) return {};

  return {
    title: service.title,
    description: service.body,
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const index = findIndex(slug);
  if (index === -1) notFound();

  return (
    <>
      <ServiceDetail service={servicesPage.items[index]} index={index + 1} />
      <Partners variant="strip" />
    </>
  );
}
