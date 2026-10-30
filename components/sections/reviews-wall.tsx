"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import { ReviewLightbox } from "@/components/ui/review-lightbox";
import { Container } from "@/components/ui/section";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE_OUT, EASE_OUT_GSAP } from "@/lib/motion";
import { replayOnScroll } from "@/lib/scroll-replay";
import { reviews, type Review } from "@/lib/reviews";

/**
 * How many masonry columns fit. Read from the viewport rather than pure CSS
 * because the columns are real elements: each review has to be dealt into the
 * shortest one, which needs to know how many there are.
 */
function columnsFor(width: number) {
  if (width < 768) return 1;
  if (width < 1280) return 2;
  if (width < 1500) return 3;
  return 4;
}

/**
 * Deal the reviews into columns, always onto the shortest one.
 *
 * Heights are predicted from each screenshot's real ratio, so the columns come
 * out balanced instead of randomly ragged — with ratios spanning 0.94 to 3.76 a
 * plain round-robin would leave one column twice the height of another.
 */
function distribute(reviews: readonly Review[], columns: number) {
  const buckets: Review[][] = Array.from({ length: columns }, () => []);
  const heights = new Array<number>(columns).fill(0);

  for (const review of reviews) {
    let shortest = 0;
    for (let i = 1; i < columns; i += 1) {
      if (heights[i] < heights[shortest]) shortest = i;
    }
    buckets[shortest].push(review);
    heights[shortest] += review.src.height / review.src.width + 0.06;
  }

  return buckets;
}

/** One card: the screenshot, its hover, and the click that opens the viewer. */
function ReviewCard({
  review,
  onOpen,
  eager,
}: {
  review: Review;
  onOpen: () => void;
  eager: boolean;
}) {
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const springX = useSpring(tiltX, { stiffness: 140, damping: 18 });
  const springY = useSpring(tiltY, { stiffness: 140, damping: 18 });

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    if (bounds.width === 0 || bounds.height === 0) return;
    // ±1.6deg: enough to feel alive, far too little to read as a gimmick.
    tiltY.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 3.2);
    tiltX.set(-((event.clientY - bounds.top) / bounds.height - 0.5) * 3.2);
  };

  const resetTilt = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  return (
    <motion.div
      layout="position"
      transition={{ duration: 0.4, ease: EASE_OUT }}
      className="review-card"
    >
      {/* GSAP owns this inner element's transform, motion owns the outer one —
          two libraries animating the same node would overwrite each other. */}
      <div data-review-card className="review-card-inner">
        <motion.div
          className="review-card-tilt"
          style={{ rotateX: springX, rotateY: springY }}
          whileHover={{ y: -5, scale: 1.01 }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
          onPointerMove={onPointerMove}
          onPointerLeave={resetTilt}
        >
          <button
            type="button"
            className="review-card-button"
            onClick={onOpen}
            aria-label={`Open the review from ${review.name}`}
          >
            <motion.span
              className="review-card-shot"
              layoutId={`review-shot-${review.id}`}
              transition={{ duration: 0.3, ease: EASE_OUT }}
            >
              <Image
                src={review.src}
                alt={`Client review from ${review.name}`}
                width={review.src.width}
                height={review.src.height}
                sizes="(max-width: 767px) 92vw, (max-width: 1279px) 46vw, (max-width: 1499px) 31vw, 23vw"
                preload={eager}
                className="review-card-image"
              />
            </motion.span>

            <span className="review-card-tag">
              {review.platform === "fiverr" ? "Fiverr" : "Upwork"}
            </span>
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function ReviewsWall() {
  const root = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(3);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // The viewer navigates the same list the wall shows, so its index is into
  // this array.
  const buckets = useMemo(() => distribute(reviews, columns), [columns]);

  useEffect(() => {
    const sync = () => setColumns(columnsFor(window.innerWidth));
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      const cards = gsap.utils.toArray<HTMLElement>("[data-review-card]", scope);
      if (cards.length === 0) return;

      // One paused tween per card, replayed as it reaches the trigger zone, so
      // a wall of 27 never animates in one go — only the ones being scrolled to.
      const entrances = new Map(
        cards.map((card) => [
          card,
          gsap.from(card, {
            opacity: 0,
            y: 25,
            duration: 0.6,
            ease: EASE_OUT_GSAP,
            paused: true,
          }),
        ]),
      );

      return replayOnScroll(cards, {
        play: (entered) =>
          entered.forEach((card, index) =>
            entrances.get(card)?.delay(index * 0.06).restart(true),
          ),
        reset: (left) =>
          left.forEach((card) => entrances.get(card)?.pause(0)),
      });
    },
    { scope: root, dependencies: [columns] },
  );

  /**
   * Calm the page's particle field as the wall gets deeper.
   *
   * The reviews are the content here; a background that is still at full
   * strength twenty screens down would just be noise behind them.
   */
  useGSAP(() => {
    const scope = root.current;
    if (!scope) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = document.querySelector<HTMLElement>(
      ".reviews-page .particle-background",
    );
    if (!canvas) return;

    gsap.to(canvas, {
      opacity: 0.2,
      ease: "none",
      scrollTrigger: {
        trigger: scope,
        start: "top center",
        end: "bottom bottom",
        scrub: true,
      },
    });
  }, {});

  const openReview = (review: Review) => {
    const position = reviews.findIndex((entry) => entry.id === review.id);
    if (position >= 0) setOpenIndex(position);
  };

  return (
    <section className="reviews-wall-section scroll-mt-24">
      <Container>
        <div ref={root} className="reviews-wall">
          {buckets.map((bucket, columnIndex) => (
            <div
              key={`column-${columnIndex}`}
              className="reviews-column"
              aria-hidden={bucket.length === 0}
            >
              {bucket.map((review, cardIndex) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  eager={columnIndex === 0 && cardIndex < columns}
                  onOpen={() => openReview(review)}
                />
              ))}
            </div>
          ))}
        </div>
      </Container>

      <ReviewLightbox
        reviews={reviews}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onNavigate={setOpenIndex}
      />
    </section>
  );
}
