"use client";

import Image from "next/image";
import { useRef } from "react";

import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { CoinCycleIcon } from "@/components/ui/icons";
import { Container } from "@/components/ui/section";
import { reviewsPage } from "@/lib/content";
import { gsap, useGSAP } from "@/lib/gsap";
import { reviews } from "@/lib/reviews";

/** Three of the real screenshots, used only as out-of-focus scenery. */
const floats = [reviews[1], reviews[12], reviews[22]] as const;

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
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // Scenery only: a slow drift that carries the blurred shots up and out of
      // the way before the wall proper begins.
      gsap.utils
        .toArray<HTMLElement>("[data-float-shot]", scope)
        .forEach((shot, index) => {
          gsap.to(shot, {
            yPercent: index % 2 === 0 ? 16 : -16,
            ease: "none",
            scrollTrigger: {
              trigger: scope,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
        });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="page-hero page-hero--compact reviews-hero">
      <div aria-hidden className="page-hero-backdrop" />

      <div aria-hidden className="reviews-hero-floats">
        {floats.map((review, index) => (
          <span
            key={review.id}
            data-float-shot
            className={`reviews-hero-float reviews-hero-float--${index + 1}`}
          >
            <Image
              src={review.src}
              alt=""
              width={review.src.width}
              height={review.src.height}
              sizes="40vw"
            />
          </span>
        ))}
      </div>

      <Container className="relative z-10">
        <Reveal trigger="mount" className="page-hero-content">
          <span className="page-hero-eyebrow">
            <CoinCycleIcon />
            {reviewsPage.eyebrow}
          </span>

          <h1 className="text-balance">{reviewsPage.title}</h1>

          <p className="page-hero-subtitle">{reviewsPage.subtitle}</p>

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
            variant="secondary"
            className="page-hero-button page-hero-button--outline"
          >
            {reviewsPage.cta.label}
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
