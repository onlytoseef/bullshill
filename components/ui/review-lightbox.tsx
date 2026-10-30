"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";

import type { Review } from "@/lib/reviews";
import { EASE_OUT } from "@/lib/motion";

type Props = {
  /** The reviews the wall is currently showing, so navigation follows a filter. */
  reviews: readonly Review[];
  /** Index into `reviews`, or null when the viewer is closed. */
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

/**
 * Full-screen viewer for one review.
 *
 * The screenshots are dense in places and some are long, so the point of this
 * is that the original is shown as large as the viewport allows and never
 * cropped — `object-fit` is only ever `contain` here.
 *
 * It is a modal: ESC closes, the arrow keys and the buttons step through the
 * filtered set, Tab stays inside, and the page behind is scroll-locked.
 */
export function ReviewLightbox({ reviews, index, onClose, onNavigate }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const open = index !== null;
  const review = index === null ? null : reviews[index];

  const step = useCallback(
    (delta: number) => {
      if (index === null || reviews.length === 0) return;
      onNavigate((index + delta + reviews.length) % reviews.length);
    },
    [index, onNavigate, reviews.length],
  );

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        step(1);
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(-1);
        return;
      }

      if (event.key !== "Tab") return;

      const focusable =
        panelRef.current?.querySelectorAll<HTMLElement>("button:not([disabled])");
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, step]);

  // Lock the page behind the viewer, and hand focus to the panel so the keys
  // land somewhere sensible. Both are put back on close.
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open, index]);

  // Warm the neighbours while the viewer is open, so stepping through the wall
  // does not show a blank frame.
  useEffect(() => {
    if (!open || index === null || reviews.length < 2) return;

    for (const offset of [1, -1]) {
      const neighbour = reviews[(index + offset + reviews.length) % reviews.length];
      const image = new window.Image();
      image.src = neighbour.src.src;
    }
  }, [open, index, reviews]);

  return (
    <AnimatePresence>
      {open && review ? (
        <motion.div
          key="review-lightbox"
          className="review-lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: EASE_OUT }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`Client review from ${review.name}`}
        >
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            className="review-lightbox-panel"
            initial={{ opacity: 0, y: 18, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.985 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
            onClick={(event) => event.stopPropagation()}
          >
            <motion.div
              className="review-lightbox-shot"
              layoutId={`review-shot-${review.id}`}
              transition={{ duration: 0.3, ease: EASE_OUT }}
            >
              <Image
                src={review.src}
                alt={`Client review from ${review.name}`}
                width={review.src.width}
                height={review.src.height}
                sizes="90vw"
                className="review-lightbox-image"
              />
            </motion.div>

            <div className="review-lightbox-bar">
              <button
                type="button"
                className="review-lightbox-nav"
                onClick={() => step(-1)}
                aria-label="Previous review"
              >
                <svg viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M14.5 5.5 8 12l6.5 6.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <span className="review-lightbox-name">{review.name}</span>

              <button
                type="button"
                className="review-lightbox-nav"
                onClick={() => step(1)}
                aria-label="Next review"
              >
                <svg viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M9.5 5.5 16 12l-6.5 6.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <button
              type="button"
              className="review-lightbox-close"
              onClick={onClose}
              aria-label="Close review"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M6 6l12 12M18 6 6 18"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
