import { PageHero } from "@/components/sections/page-hero";
import { Button } from "@/components/ui/button";
import { reviewsPage } from "@/lib/content";

function Stars() {
  return (
    <span className="reviews-stars" role="img" aria-label="Rated 4.9 out of 5">
      {Array.from({ length: 5 }, (_, index) => (
        <svg key={index} aria-hidden viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </span>
  );
}

export function ReviewsHero() {
  return (
    <PageHero title={reviewsPage.title} eyebrow={reviewsPage.eyebrow} subtitle={reviewsPage.subtitle}>
          <ul className="reviews-trust">
            <li>
              <Stars />
              <strong>4.9/5</strong>
            </li>
            <li>
              <strong>3000+</strong> satisfied customers
            </li>
          </ul>

          <Button
            href={reviewsPage.cta.href}
            variant="primary"
            className="page-hero-button"
          >
            {reviewsPage.cta.label}
          </Button>
    </PageHero>
  );
}
