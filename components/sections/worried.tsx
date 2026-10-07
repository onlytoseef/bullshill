import { Parallax } from "@/components/motion/parallax";
import { Reveal } from "@/components/motion/reveal";
import { PlaceholderVisual } from "@/components/ui/placeholder-visual";
import { SectionHeading } from "@/components/ui/section-heading";
import { Container, Section } from "@/components/ui/section";
import { worried } from "@/lib/content";

export function Worried() {
  return (
    <Section className="worried-section">
      <Container>
        <SectionHeading
          title={worried.title}
          className="worried-heading mb-14"
        />

        <Parallax amount={8} className="mx-auto max-w-[1179px]">
          <div className="worried-video-frame">
            <PlaceholderVisual
              label="Campaign hero visual"
              from="#0d1b2e"
              to="#120b08"
              className="size-full rounded-[26px]"
            />
            <button
              type="button"
              aria-label="Play project video"
              className="worried-play-button"
            >
              <svg aria-hidden viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.3 5.9a1 1 0 0 1 1.55-.83l7.7 5.1a1 1 0 0 1 0 1.66l-7.7 5.1a1 1 0 0 1-1.55-.83V5.9Z" />
              </svg>
            </button>
          </div>
        </Parallax>
      </Container>
    </Section>
  );
}
