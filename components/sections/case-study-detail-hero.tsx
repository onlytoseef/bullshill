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
                  width={image.width}
                  height={image.height}
                  sizes="1140px"
                  className="block h-auto w-full"
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
              {caseStudyDetail.metrics.map((metric) => {
                // Split for styling only: the figure is what the landing page's
                // stats paint in metallic orange. The counter counts this
                // element (`data-case-figure`), so the label beside it is left
                // as its own text node, untouched.
                const [figure, ...label] = metric.split(" ");
                return (
                  <li key={metric} data-case-metric>
                    <strong data-case-figure>{figure}</strong> {label.join(" ")}
                  </li>
                );
              })}
            </ul>
          </div>
        </CaseHeroReveal>
      </Container>
    </section>
  );
}
