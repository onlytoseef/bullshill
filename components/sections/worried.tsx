import { Parallax } from "@/components/motion/parallax";
import { ParticleBackground } from "@/components/motion/particle-background";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { Container, Section } from "@/components/ui/section";
import { WorriedVideo } from "@/components/sections/worried-video";
import { worried } from "@/lib/content";

export function Worried() {
  return (
    <Section className="worried-section has-particles">
      <ParticleBackground />
      <Container>
        <SectionHeading
          title={worried.title}
          className="worried-heading mb-14"
        />

        {/* The frame rises and fades in as the section reaches the viewport, and
            replays on every return. The parallax sits inside it, so the two
            transforms compose rather than fight. */}
        <Reveal y={56} duration={0.9} className="w-full">
          <Parallax amount={8} className="w-full">
            <div className="worried-video-frame">
              <WorriedVideo />
            </div>
          </Parallax>
        </Reveal>
      </Container>
    </Section>
  );
}
