import { CaseStoryReveal } from "@/components/motion/case-study-reveal";
import { WandIcon } from "@/components/ui/icons";
import { Container } from "@/components/ui/section";
import { caseStudyDetail } from "@/lib/content";

export function CaseStudyDetailStory() {
  return (
    <section className="case-detail-story">
      <Container>
        <CaseStoryReveal>
          {caseStudyDetail.blocks.map((block) => (
            <div key={block.eyebrow} data-case-block className="case-detail-block">
              <span data-case-eyebrow className="case-detail-eyebrow">
                <WandIcon />
                {block.eyebrow}
              </span>
              <h2>{block.title}</h2>
              {block.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          ))}

          <ul data-case-tracks className="case-detail-tracks">
            {caseStudyDetail.tracks.map((track) => (
              <li key={track.title} data-case-track>
                <h3>{track.title}</h3>
                <p>{track.body}</p>
              </li>
            ))}
          </ul>
        </CaseStoryReveal>
      </Container>
    </section>
  );
}
