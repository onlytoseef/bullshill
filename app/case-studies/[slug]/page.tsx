import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CaseStudyDetailHero } from "@/components/sections/case-study-detail-hero";
import { CaseStudyDetailResults } from "@/components/sections/case-study-detail-results";
import { CaseStudyDetailStory } from "@/components/sections/case-study-detail-story";
import { FinalCta } from "@/components/sections/final-cta";
import { Partners } from "@/components/sections/partners";
import { caseStudiesPage } from "@/lib/content";

type Props = {
  params: Promise<{ slug: string }>;
};

const findStudy = (slug: string) =>
  caseStudiesPage.items.find((study) => study.slug === slug);

export function generateStaticParams() {
  return caseStudiesPage.items.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = findStudy(slug);
  if (!study) return {};

  return {
    title: study.client,
    description: `${study.summaryLead}${study.summaryRest}`,
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const study = findStudy(slug);
  if (!study) notFound();

  return (
    <>
      <CaseStudyDetailHero study={study} />
      <CaseStudyDetailStory />
      <CaseStudyDetailResults />
      <Partners variant="strip" />
      <FinalCta variant="page" />
    </>
  );
}
