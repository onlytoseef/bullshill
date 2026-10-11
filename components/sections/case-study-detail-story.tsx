import { Reveal } from "@/components/motion/reveal";
import { SendIcon, TagGlyph, UpdatesIcon } from "@/components/ui/icons";
import { Container } from "@/components/ui/section";
import { caseStudyDetail } from "@/lib/content";

const glyphs = [<UpdatesIcon key="0" />, <TagGlyph key="1" />, <SendIcon key="2" />];

export function CaseStudyDetailStory() {
  return (
    <section className="case-detail-story">
      <Container>
        {caseStudyDetail.blocks.map((block, index) => (
          <Reveal key={block.eyebrow} className="case-detail-block">
            <span className="case-detail-eyebrow">
              {glyphs[index]}
              {block.eyebrow}
            </span>
            <h2>{block.title}</h2>
            {block.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Reveal>
        ))}

        <Reveal>
          <ul className="case-detail-tracks">
            {caseStudyDetail.tracks.map((track) => (
              <li key={track.title}>
                <h3>{track.title}</h3>
                <p>{track.body}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
