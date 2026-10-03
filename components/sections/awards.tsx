import { Parallax } from "@/components/motion/parallax";
import { Stagger } from "@/components/motion/stagger";
import { SectionHeading } from "@/components/ui/section-heading";
import { Container, Section } from "@/components/ui/section";
import { awards } from "@/lib/content";

export function Awards() {
  return (
    <Section id="about">
      <Container>
        <SectionHeading
          title={awards.title}
          subtitle={awards.subtitle}
          className="mb-16"
        />

        <Stagger className="grid gap-6 sm:grid-cols-3" stagger={0.12}>
          {awards.people.map((person, index) => (
            // Alternating drift so the three portraits don't move as one block.
            <Parallax key={person.name} amount={index % 2 === 0 ? 6 : 12}>
              <figure
                className="relative isolate aspect-[3/4] overflow-hidden rounded-3xl ring-1 ring-white/10"
                style={{
                  backgroundImage: `linear-gradient(160deg, ${person.from}, ${person.to})`,
                }}
              >
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
