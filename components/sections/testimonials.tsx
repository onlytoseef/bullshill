import { Stagger } from "@/components/motion/stagger";
import { SectionHeading } from "@/components/ui/section-heading";
import { Container, Section } from "@/components/ui/section";
import { testimonials } from "@/lib/content";

function Stars() {
  return (
    <div className="flex gap-0.5" aria-label="Rated 5 out of 5">
      {Array.from({ length: 5 }, (_, index) => (
        <svg
          key={index}
          aria-hidden
          viewBox="0 0 20 20"
          fill="currentColor"
          className="size-4 text-orange"
        >
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <Section id="testimonials">
      <Container>
        <SectionHeading
          eyebrow={testimonials.eyebrow}
          title={testimonials.title}
          subtitle={testimonials.subtitle}
          className="mb-16"
        />

        <Stagger className="grid gap-6 lg:grid-cols-3" stagger={0.1}>
          {testimonials.items.map((item) => (
            <figure
              key={item.name}
              className="flex h-full flex-col rounded-3xl border border-surface-border bg-surface-card p-8"
            >
              <Stars />

              <blockquote className="mt-6 flex-1 text-base leading-relaxed text-blue-light">
                {item.quote}
              </blockquote>

              <figcaption className="mt-8 flex items-center gap-4">
                {/* Gradient monogram until headshots land in
                    public/assets/images/ */}
                <span
                  aria-hidden
                  className="grid size-11 shrink-0 place-items-center rounded-full text-sm font-semibold text-white"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${item.from}, ${item.to})`,
                  }}
                >
                  {item.initials}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-white">
                    {item.name}
                  </span>
                  <span className="block truncate text-sm text-blue-light-active">
                    {item.role}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
