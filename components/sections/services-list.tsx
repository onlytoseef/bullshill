import { Reveal } from "@/components/motion/reveal";
import { ServiceRow } from "@/components/ui/service-row";
import { Container, Section } from "@/components/ui/section";
import { servicesPage } from "@/lib/content";

export function ServicesList() {
  return (
    <Section className="pt-12 sm:pt-16">
      <Container>
        <Reveal
          trigger="mount"
          className="flex flex-wrap items-center justify-between gap-4"
        >
          <h1 className="text-display-sm font-semibold text-white sm:text-display-md">
            {servicesPage.title}
          </h1>

          <span className="inline-flex items-center gap-2 rounded-full border border-surface-border bg-surface-card/60 px-4 py-1.5 text-xs font-medium tracking-wide text-blue-light-active uppercase">
            <span aria-hidden className="size-1.5 rounded-full bg-orange" />
            {servicesPage.eyebrow}
          </span>
        </Reveal>

        <ul className="mt-8 divide-y divide-surface-border/60">
          {servicesPage.items.map((service, index) => (
            <ServiceRow
              key={service.title}
              index={index + 1}
              title={service.title}
              body={service.body}
              tags={servicesPage.tags}
              caption={servicesPage.caption}
              cta={{
                label: servicesPage.cta.label,
                href: `/services/${service.slug}`,
              }}
              visual={service.visual}
            />
          ))}
        </ul>
      </Container>
    </Section>
  );
}
