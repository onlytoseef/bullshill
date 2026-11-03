"use client";

import { useLenis } from "lenis/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { AutoplayCarousel } from "@/components/ui/autoplay-carousel";
import { Button } from "@/components/ui/button";
import { CarouselItem } from "@/components/ui/carousel";
import { ReviewLightbox } from "@/components/ui/review-lightbox";
import { reviews } from "@/lib/reviews";

/** Keep the original three first, then include every remaining screenshot. */
const featuredIds = ["6251", "6258", "6253"];
const carouselReviews = [
  ...featuredIds.flatMap((id) => reviews.filter((review) => review.id === id)),
  ...reviews.filter((review) => !featuredIds.includes(review.id)),
];

function ReviewExcerpt({
  quote,
  name,
  onRead,
}: {
  quote: string;
  name: string;
  onRead: (button: HTMLButtonElement) => void;
}) {
  const ref = useRef<HTMLQuoteElement>(null);
  const [truncated, setTruncated] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let active = true;
    const measure = () => {
      if (active) setTruncated(element.scrollHeight > element.clientHeight + 1);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    measure();
    void document.fonts.ready.then(measure);

    return () => {
      active = false;
      observer.disconnect();
    };
  }, [quote]);

  return (
    <>
      <blockquote ref={ref} className="testimonial-quote testimonial-quote--carousel">
        {quote}
      </blockquote>
      {truncated ? (
        <Button
          type="button"
          variant="text"
          size="sm"
          className="testimonial-read-more"
          aria-label={`Read the full review from ${name}`}
          onClick={(event) => onRead(event.currentTarget)}
        >
          Read full review
        </Button>
      ) : null}
    </>
  );
}

function ReviewStars({ rating }: { rating: number }) {
  const star = "M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z";

  return (
    <div className="testimonial-stars" role="img" aria-label={`Rated ${rating} out of 5`}>
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index} aria-hidden className="testimonial-star">
          <svg className="testimonial-star-empty" viewBox="0 0 20 20" fill="currentColor">
            <path d={star} />
          </svg>
          <span
            className="testimonial-star-fill"
            style={{ width: `${Math.max(0, Math.min(1, rating - index)) * 100}%` }}
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d={star} />
            </svg>
          </span>
        </span>
      ))}
      <span aria-hidden className="testimonial-rating-value">{rating.toFixed(1)}</span>
    </div>
  );
}

export function TestimonialsCarousel() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const lenis = useLenis();
  const open = openIndex !== null;

  useEffect(() => {
    if (!open || !lenis) return;
    const wasStopped = lenis.isStopped;
    lenis.stop();
    return () => {
      if (!wasStopped) lenis.start();
    };
  }, [lenis, open]);

  const close = useCallback(() => {
    setOpenIndex(null);
    trigger.current?.focus({ preventScroll: true });
  }, []);

  const showReview = (index: number, button: HTMLButtonElement) => {
    trigger.current = button;
    setOpenIndex(index);
  };

  return (
    <>
      <AutoplayCarousel
        label="Client reviews"
        pageLabel="review"
        className="testimonials-carousel"
        trackClassName="testimonials-track"
        paused={open}
      >
        {carouselReviews.map((review, index) => {
          const platform = review.platform === "fiverr" ? "Fiverr" : "Upwork";
          return (
            <CarouselItem
              key={review.id}
              className="testimonials-slide"
              aria-label={`${index + 1} of ${carouselReviews.length}`}
            >
              <figure
                className="testimonial-card testimonial-card--carousel flex h-full flex-col text-left"
              >
                <button
                  type="button"
                  className="testimonial-screenshot-button"
                  aria-label={`Open ${platform} review from ${review.name}`}
                  onClick={(event) => showReview(index, event.currentTarget)}
                >
                  <span className="testimonial-image testimonial-image--review">
                    <Image
                      src={review.src}
                      alt={`${platform} client review from ${review.name}`}
                      fill
                      sizes="(max-width: 767px) 80vw, (max-width: 1023px) 46vw, (max-width: 1279px) 31vw, 366px"
                    />
                  </span>
                </button>

                <div className="testimonial-rating">
                  <ReviewStars rating={review.rating} />
                  <span aria-hidden className="testimonial-quote-mark">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7.17 6A5.17 5.17 0 0 0 2 11.17V18h6.83v-6.83H5.42a1.75 1.75 0 0 1 1.75-1.75V6Z" />
                      <path d="M16.58 6a5.17 5.17 0 0 0-5.17 5.17V18h6.83v-6.83h-3.41a1.75 1.75 0 0 1 1.75-1.75V6Z" />
                    </svg>
                  </span>
                </div>

                <ReviewExcerpt
                  quote={review.quote}
                  name={review.name}
                  onRead={(button) => showReview(index, button)}
                />

                <figcaption className="testimonial-author">
                  <span
                    aria-hidden
                    className={`testimonial-avatar testimonial-avatar--${review.platform}`}
                  >
                    {review.platform === "fiverr" ? review.name[0].toUpperCase() : "U"}
                  </span>
                  <span className="testimonial-author-text">
                    <span className="testimonial-author-name">{review.name}</span>
                    <span className="testimonial-author-role">
                      {review.country ? `${review.country} · ${platform}` : platform}
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
            </CarouselItem>
          );
        })}
      </AutoplayCarousel>
      <ReviewLightbox
        reviews={carouselReviews}
        index={openIndex}
        onClose={close}
        onNavigate={setOpenIndex}
      />
    </>
  );
}
