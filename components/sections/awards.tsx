import Image from "next/image";

import { Parallax } from "@/components/motion/parallax";
import { Stagger } from "@/components/motion/stagger";
import { Container, Section } from "@/components/ui/section";
import { awards } from "@/lib/content";
import bilalImage from "../../app/assets/team-section/1.png";
import zeeshanImage from "../../app/assets/team-section/2.png";
import jawadImage from "../../app/assets/team-section/3.png";

const teamImages = [jawadImage, zeeshanImage, bilalImage] as const;

export function Awards() {
  return (
    <Section id="about">
      <Container>
        <div className="awards-heading mb-16">
          <span className="awards-eyebrow">{awards.eyebrow}</span>
          <h2>{awards.title}</h2>
          <p>{awards.subtitle}</p>
        </div>

        <Stagger className="awards-grid" stagger={0.12}>
          {awards.people.map((person, index) => (
            // Alternating drift so the three portraits don't move as one block.
            <Parallax key={person.name} amount={index % 2 === 0 ? 6 : 12}>
              <figure
                className="awards-card relative isolate overflow-hidden"
              >
                <Image
                  src={teamImages[index]}
                  alt={person.name}
                  fill
                  sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 460px"
                  className="object-cover"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"
                />
                <figcaption className="absolute inset-x-0 bottom-0 p-6">
                  <span className="block text-lg font-semibold text-white">
                    {person.name}
                  </span>
                  <span className="block text-sm text-white/70">
                    {person.role}
                  </span>
                </figcaption>
              </figure>
            </Parallax>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
