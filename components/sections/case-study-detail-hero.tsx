import { CaseHeroReveal } from "@/components/motion/case-study-reveal";
import { PlaceholderVisual } from "@/components/ui/placeholder-visual";
import { Container } from "@/components/ui/section";
import { caseStudyDetail, type CaseStudy } from "@/lib/content";

export function CaseStudyDetailHero({ study }: { study: CaseStudy }) {
  return (
    <section className="case-detail-hero">
      <div
        aria-hidden
        className="page-hero-backdrop page-hero-backdrop--image"
      />

      <Container className="relative z-10">
        <CaseHeroReveal>
          <div data-case-cover className="case-detail-cover">
            <PlaceholderVisual
              from={study.visual.from}
              to={study.visual.to}
              className="case-detail-cover-image"
            />
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
