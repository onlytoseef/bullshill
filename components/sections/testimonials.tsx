import { Stagger } from "@/components/motion/stagger";
import Image from "next/image";
import { Container, Section } from "@/components/ui/section";
import { testimonials } from "@/lib/content";
import tokenMarketingImage from "../../app/assets/services-section/token-marketing.png";
import socialMediaMarketingImage from "../../app/assets/services-section/social-media-marketing.png";
import aiProductLaunchImage from "../../app/assets/services-section/ai-product-launch.png";

const testimonialImages = [
  tokenMarketingImage,
  socialMediaMarketingImage,
  aiProductLaunchImage,
] as const;

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
    <Section id="testimonials" className="testimonials-section">
      <Container>
        <div className="testimonials-heading mb-16">
          <span className="testimonials-eyebrow">{testimonials.eyebrow}</span>
          <h2>{testimonials.title}</h2>
          <p>{testimonials.subtitle}</p>
        </div>

        <Stagger className="testimonials-grid" stagger={0.1}>
          {testimonials.items.map((item, index) => (
            <figure
              key={item.name}
              className="testimonial-card flex h-full flex-col"
            >
              <div className="testimonial-image">
                <Image
                  src={testimonialImages[index]}
                  alt=""
                  fill
                  sizes="335px"
                  className="object-cover"
                />
              </div>
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
