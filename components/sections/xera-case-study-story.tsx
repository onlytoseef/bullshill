import { Container } from "@/components/ui/section";

type CaseStudyStoryData = {
  challenge: readonly string[];
  approachIntro: string;
  approach: readonly {
    title: string;
    body: string;
    bullets?: readonly string[];
  }[];
  resultCards: readonly { value: string; label: string }[];
  takeaways: readonly { title: string; body: string }[];
  ctaTitle: string;
  ctaBody: string;
};

export function CaseStudyStory({ story }: { story: CaseStudyStoryData }) {
  return (
    <article className="xera-case-story">
      <Container>
        <section className="xera-story-section" aria-labelledby="case-study-challenge">
          <span className="xera-story-label">The Challenge</span>
          <h2 id="case-study-challenge">Turning a token launch into lasting community growth</h2>
          {story.challenge.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </section>

        <section className="xera-story-section" aria-labelledby="case-study-approach">
          <span className="xera-story-label">Our Approach</span>
          <h2 id="case-study-approach">A coordinated launch strategy</h2>
          <p className="xera-story-intro">{story.approachIntro}</p>
          <ol className="xera-approach-list">
            {story.approach.map((step, index) => (
              <li key={step.title}>
                <span className="xera-approach-number">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                  {step.bullets ? (
                    <ul className="xera-approach-bullets">
                      {step.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                    </ul>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="xera-results-section" aria-labelledby="case-study-results">
          <span className="xera-story-label">Campaign Results</span>
          <h2 id="case-study-results">Results that speak for themselves</h2>
          <ul className="xera-results-grid">
            {story.resultCards.map((result) => (
              <li key={result.label}>
                <strong className="about-stat-value">{result.value}</strong>
                <span>{result.label}</span>
              </li>
            ))}
          </ul>
          <h3 className="xera-takeaways-title">Key takeaways</h3>
          <ul className="xera-takeaways-list">
            {story.takeaways.map((item) => (
              <li key={item.title}><strong>{item.title}</strong> {item.body}</li>
            ))}
          </ul>
        </section>

      </Container>
    </article>
  );
}

export function CaseStudyStoryCta({ story }: { story: CaseStudyStoryData }) {
  return (
    <section className="xera-case-cta-section">
      <Container>
        <div className="xera-story-cta" aria-labelledby="case-study-cta-title">
          <h2 id="case-study-cta-title">{story.ctaTitle}</h2>
          <p>{story.ctaBody}</p>
          <a href="/contact">Contact our team</a>
        </div>
      </Container>
    </section>
  );
}
