import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { UpdatesIcon } from "@/components/ui/icons";
import { Container } from "@/components/ui/section";
import { caseStudiesPage } from "@/lib/content";

/**
 * Case studies index header.
 *
 * Mirrors the blog hero: not built on <Section>/<SectionHeading> because this
 * needs the page's only <h1> and a tighter rhythm than the home page.
 */
export function CaseStudiesHero() {
  return (
    <section className="pt-16 pb-10 sm:pt-20 sm:pb-14">
      <Container>
        {/* Above the fold, so play on mount rather than waiting for an
            intersection callback. */}
        <Reveal
          trigger="mount"
          className="flex flex-col items-center text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-surface-border bg-surface-card/60 px-4 py-1.5 text-xs font-medium text-blue-light-active">
            <UpdatesIcon />
            {caseStudiesPage.eyebrow}
          </span>

          <h1 className="mt-6 text-display-md font-semibold text-balance text-white sm:text-display-lg">
            {caseStudiesPage.title}
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-relaxed text-blue-light-active sm:text-base">
            {caseStudiesPage.subtitle}
          </p>

          <Button
            href={caseStudiesPage.cta.href}
            variant="light"
            size="md"
            className="mt-8"
          >
            {caseStudiesPage.cta.label}
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
