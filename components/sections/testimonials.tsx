import { Stagger } from "@/components/motion/stagger";
import { StaggerHeading } from "@/components/motion/stagger-heading";
import Image from "next/image";
import { Container, Section } from "@/components/ui/section";
import { testimonials } from "@/lib/content";
import tokenMarketingImage from "../../app/assets/services-section/token-marketing.webp";
import socialMediaMarketingImage from "../../app/assets/services-section/social-media-marketing.webp";
import aiProductLaunchImage from "../../app/assets/services-section/ai-product-launch.webp";

const testimonialImages = [
  tokenMarketingImage,
  socialMediaMarketingImage,
  aiProductLaunchImage,
] as const;

function Stars() {
  return (
    <div className="testimonial-stars" role="img" aria-label="Rated 5 out of 5">
      {Array.from({ length: 5 }, (_, index) => (
        <svg key={index} aria-hidden viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <Section id="testimonials" className="testimonials-section bubble-zone">
      <Container>
        <StaggerHeading
          eyebrow={testimonials.eyebrow}
          title={testimonials.title}
          subtitle={testimonials.subtitle}
          className="testimonials-heading mb-16"
          eyebrowClassName="testimonials-eyebrow"
        />

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
                  sizes="(max-width: 767px) 92vw, (max-width: 1023px) 46vw, 366px"
                  className="object-cover"
                />
              </div>

              <div className="testimonial-rating">
                <Stars />
                <span aria-hidden className="testimonial-quote-mark">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.17 6A5.17 5.17 0 0 0 2 11.17V18h6.83v-6.83H5.42a1.75 1.75 0 0 1 1.75-1.75V6Z" />
                    <path d="M16.58 6a5.17 5.17 0 0 0-5.17 5.17V18h6.83v-6.83h-3.41a1.75 1.75 0 0 1 1.75-1.75V6Z" />
                  </svg>
                </span>
              </div>

              <blockquote className="testimonial-quote">{item.quote}</blockquote>

              <figcaption className="testimonial-author">
                <span
                  aria-hidden
                  className="testimonial-avatar"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${item.from}, ${item.to})`,
                  }}
                >
                  {item.initials}
                </span>

                <span className="testimonial-author-text">
                  <span className="testimonial-author-name">{item.name}</span>
                  <span className="testimonial-author-role">
                    {item.role}
                  </span>
                </span>

                <span aria-hidden className="testimonial-arrow">
                  <svg
                    viewBox="0 0 14 14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3.5 10.5 10.5 3.5M5.2 3.5h5.3v5.3" />
                  </svg>
                </span>
              </figcaption>
            </figure>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
