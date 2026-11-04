import Image from "next/image";

import { CaseHeroReveal } from "@/components/motion/case-study-reveal";
import { ParticleBackground } from "@/components/motion/particle-background";
import { PageHero } from "@/components/sections/page-hero";
import { Container } from "@/components/ui/section";
import { caseStudyDetail, type CaseStudy } from "@/lib/content";
import { caseStudyImages } from "@/components/ui/case-study-row";

export function CaseStudyDetailHero({ study }: { study: CaseStudy }) {
  const image = caseStudyImages[study.slug];

  return (
    <>
    <PageHero title={study.client} eyebrow="Case study" subtitle={`${study.summaryLead}${study.summaryRest}`} />
    <section className="inner-page-content case-detail-hero has-particles inner-content-grains">
      <ParticleBackground />
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
    </>
  );
}
