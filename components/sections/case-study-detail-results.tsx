import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/ui/section";
import { caseStudyDetail } from "@/lib/content";

const { results } = caseStudyDetail;

export function CaseStudyDetailResults() {
  return (
    <section className="case-detail-results">
      <Container>
        <Reveal className="case-detail-results-heading">
          <span className="case-detail-eyebrow">{results.eyebrow}</span>
          <h2>{results.title}</h2>
          <p>{results.subtitle}</p>
        </Reveal>

        <Reveal delay={0.1}>
          <dl className="case-detail-stats">
            {results.stats.map((stat) => (
              <div key={stat.label} className="case-detail-stat">
                <dt>{stat.label}</dt>
                <dd>{stat.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Container>
    </section>
  );
}
