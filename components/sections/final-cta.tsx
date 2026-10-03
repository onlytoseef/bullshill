import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/section";
import { finalCta } from "@/lib/content";

/**
 * Closing call to action: a dark card sitting on the page's light bottom
 * region, which continues into the footer.
 */
export function FinalCta() {
  return (
    <Section id="contact" className="bg-blue-light pb-12 sm:pb-16">
      <Container>
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-[2rem] bg-blue-darker px-8 py-16 text-center sm:px-16 sm:py-20">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-40 left-1/2 size-[32rem] -translate-x-1/2 rounded-full opacity-30 blur-[120px]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, var(--color-blue) 0%, transparent 70%)",
              }}
            />
            <h2 className="relative text-display-sm font-semibold text-balance text-white sm:text-display-md">
              {finalCta.title}
            </h2>
            <Button
              href={finalCta.cta.href}
              variant="light"
              size="lg"
              className="relative mt-8"
            >
              {finalCta.cta.label}
            </Button>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
