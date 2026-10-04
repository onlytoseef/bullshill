import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { SendIcon, UpdatesIcon } from "@/components/ui/icons";
import { Container } from "@/components/ui/section";
import { blogPage } from "@/lib/content";

/**
 * Blog index header.
 *
 * Deliberately not built on <Section>/<SectionHeading>: this needs the page's
 * only <h1>, and the vertical rhythm here is tighter than the home page's.
 */
export function BlogHero() {
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
            {blogPage.eyebrow}
          </span>

          <h1 className="mt-6 text-display-md font-semibold text-balance text-white sm:text-display-lg">
            {blogPage.title}
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-relaxed text-blue-light-active sm:text-base">
            {blogPage.subtitle}
          </p>

          <Button
            href={blogPage.cta.href}
            variant="light"
            size="md"
            className="mt-8"
          >
            {blogPage.cta.label}
            <SendIcon />
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
