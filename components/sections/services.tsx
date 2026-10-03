import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { ArrowIcon } from "@/components/ui/icons";
import { PlaceholderVisual } from "@/components/ui/placeholder-visual";
import { SectionHeading } from "@/components/ui/section-heading";
import { Container, Section } from "@/components/ui/section";
import { TagPill } from "@/components/ui/tag-pill";
import { services } from "@/lib/content";

export function Services() {
  return (
    <Section id="services">
      <Container>
        <SectionHeading
          eyebrow={services.eyebrow}
          title={services.title}
          className="mb-16"
        />

        <ul className="flex flex-col gap-6">
          {services.items.map((service, index) => (
            <li key={service.title}>
              <div className="grid gap-8 rounded-3xl border border-surface-border bg-surface-card p-6 sm:p-10 lg:grid-cols-2 lg:items-center lg:gap-14">
                {/* Copy and artwork enter from opposite sides, so the eye is
                    pulled across the row rather than straight down the page. */}
                <Reveal x={-32} y={0}>
                  <div className="flex items-start gap-5">
                    <span
                      aria-hidden
                      className="hidden shrink-0 text-display-xs font-semibold text-orange/40 tabular-nums sm:block"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div>
                      <h3 className="text-display-xs font-semibold text-white sm:text-display-sm">
                        {service.title}
                      </h3>
                      <p className="mt-4 text-base text-blue-light-active">
                        {service.body}
                      </p>

                      <ul className="mt-6 flex flex-wrap gap-2">
                        {service.tags.map((tag) => (
                          <li key={tag}>
                            <TagPill>{tag}</TagPill>
                          </li>
                        ))}
                      </ul>

                      <Button
                        href={service.href}
                        variant="secondary"
                        size="sm"
                        className="mt-8"
                      >
                        Find out more
                        <ArrowIcon />
                      </Button>
                    </div>
                  </div>
                </Reveal>

                <Reveal x={32} y={0} delay={0.1}>
                  <PlaceholderVisual
                    label={service.visual.label}
                    from={service.visual.from}
                    to={service.visual.to}
                    className="aspect-[4/3] w-full"
                  />
                </Reveal>
              </div>
            </li>
          ))}
        </ul>

        <Reveal className="mt-14 flex justify-center">
          <Button href={services.cta.href} variant="secondary" size="md">
            {services.cta.label}
            <ArrowIcon />
          </Button>
        </Reveal>
      </Container>
    </Section>
  );
}
