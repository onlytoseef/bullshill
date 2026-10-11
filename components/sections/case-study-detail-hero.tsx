import { Reveal } from "@/components/motion/reveal";
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
        <Reveal trigger="mount" className="case-detail-cover">
          <PlaceholderVisual
            from={study.visual.from}
            to={study.visual.to}
            className="case-detail-cover-image"
          />
        </Reveal>

        <Reveal trigger="mount" delay={0.15} className="case-detail-intro">
          <h1>{study.client}</h1>
          <p>
            <span>{study.summaryLead}</span>
            {study.summaryRest}
          </p>

          <ul>
            {caseStudyDetail.metrics.map((metric) => (
              <li key={metric}>{metric}</li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
