import Image from "next/image";

import { CaseHeroReveal } from "@/components/motion/case-study-reveal";
import { Container } from "@/components/ui/section";
import { caseStudyDetail, type CaseStudy } from "@/lib/content";
import { caseStudyImages } from "@/components/ui/case-study-row";

export function CaseStudyDetailHero({ study }: { study: CaseStudy }) {
  const image = caseStudyImages[study.slug];

  return (
    <section className="case-detail-hero">
      <div
        aria-hidden
        className="page-hero-backdrop page-hero-backdrop--image"
      />

      <Container className="relative z-10">
        <CaseHeroReveal>
          <div data-case-cover className="case-detail-cover">
            <div className="case-detail-cover-image">
              {image ? (
                <Image
                  src={image}
                  alt={study.client}
                  fill
                  sizes="1140px"
                  className="object-cover"
                  priority
                />
              ) : null}
            </div>
          </div>

          <div className="case-detail-intro">
            <h1 data-case-title>{study.client}</h1>
            <p data-case-summary>
              <span>{study.summaryLead}</span>
              {study.summaryRest}
            </p>

            <ul>
              {caseStudyDetail.metrics.map((metric) => (
                <li key={metric} data-case-metric>
                  {metric}
                </li>
              ))}
            </ul>
          </div>
        </CaseHeroReveal>
      </Container>
    </section>
  );
}
