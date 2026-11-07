import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import { CaseStudyDetailHero } from "@/components/sections/case-study-detail-hero";
import {
  CaseStudyStory,
  CaseStudyStoryCta,
} from "@/components/sections/xera-case-study-story";
import { FinalCta } from "@/components/sections/final-cta";
import { Partners } from "@/components/sections/partners";
import {
  amalasCaseStudy,
  avirvoxCaseStudy,
  caseStudiesPage,
  cryptoXCaseStudy,
  dmtNoderocksCaseStudy,
  pcpCaseStudy,
  redditCaseStudy,
  xeraCaseStudy,
} from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

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

  return pageMetadata({
    title: study.seoTitle ?? study.detailTitle ?? study.client,
    description:
      study.seoDescription ?? `${study.summaryLead}${study.summaryRest}`,
    path: `/case-studies/${slug}`,
    absolute: Boolean(study.seoTitle),
  });
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  if (slug === "xera") {
    permanentRedirect("/case-studies/xera-token-launch-marketing");
  }
  if (slug === "amalas") {
    permanentRedirect("/case-studies/amalas-token-launch-marketing");
  }
  if (slug === "pcp") {
    permanentRedirect("/case-studies/pcp-memecoin-launch-marketing");
  }
  if (slug === "avx") {
    permanentRedirect("/case-studies/avirvox-labs-ai-token-fundraising");
  }
  const study = findStudy(slug);
  if (!study) notFound();
  const story =
    slug === "xera-token-launch-marketing"
      ? xeraCaseStudy
      : slug === "amalas-token-launch-marketing"
      ? amalasCaseStudy
      : slug === "pcp-memecoin-launch-marketing"
      ? pcpCaseStudy
      : slug === "avirvox-labs-ai-token-fundraising"
      ? avirvoxCaseStudy
      : slug === "dmt-tikabit-noderocks-bitcoin-ordinals"
      ? dmtNoderocksCaseStudy
      : slug === "reddit-marketing-aeo-geo-web3-ai"
      ? redditCaseStudy
      : slug === "crypto-x-marketing-grow-x-followers"
      ? cryptoXCaseStudy
      : null;

  return (
    <>
      <CaseStudyDetailHero study={study} />
      {story ? <CaseStudyStory story={story} /> : null}
      <Partners variant="strip" />
      {story ? <CaseStudyStoryCta story={story} /> : null}
      <FinalCta variant="page" />
    </>
  );
}
