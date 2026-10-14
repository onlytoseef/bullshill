import { Parallax } from "@/components/motion/parallax";
import { SectionHeading } from "@/components/ui/section-heading";
import { Container, Section } from "@/components/ui/section";
import { WorriedVideo } from "@/components/sections/worried-video";
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
            <WorriedVideo />
          </div>
        </Parallax>
      </Container>
    </Section>
  );
}
