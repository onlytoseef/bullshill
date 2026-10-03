import { Reveal } from "@/components/motion/reveal";
import { Container, Section } from "@/components/ui/section";
import { intro } from "@/lib/content";

export function Intro() {
  return (
    <Section className="py-12 sm:py-16">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-surface-border bg-surface-card px-8 py-12 sm:px-14 sm:py-16">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-24 -right-16 size-72 rounded-full opacity-20 blur-3xl"
              style={{
                backgroundImage:
                  "radial-gradient(circle, var(--color-orange) 0%, transparent 70%)",
              }}
            />
            <p className="relative max-w-4xl text-xl leading-relaxed text-balance text-white sm:text-2xl">
              {intro.body}
            </p>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
