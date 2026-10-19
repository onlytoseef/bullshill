import { CaseResultsReveal } from "@/components/motion/case-study-reveal";
import { Container } from "@/components/ui/section";
import { caseStudyDetail } from "@/lib/content";

const { results } = caseStudyDetail;

export function CaseStudyDetailResults() {
  return (
    <section className="case-detail-results">
      <Container>
        <CaseResultsReveal>
          <div data-case-results-heading className="case-detail-results-heading">
            <span data-case-eyebrow className="case-detail-eyebrow">
              {results.eyebrow}
            </span>
            <h2>{results.title}</h2>
            <p>{results.subtitle}</p>
          </div>

          <dl className="case-detail-stats">
            {results.stats.map((stat) => (
              <div key={stat.label} data-case-stat className="case-detail-stat">
                <dt>{stat.label}</dt>
                <dd data-case-count>{stat.value}</dd>
              </div>
            ))}
          </dl>
        </CaseResultsReveal>
      </Container>
    </section>
  );
}
