"use client";

import { useLenis } from "lenis/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const VIDEO_ID = "eVqW5T5TQUU";
const EMBED_SRC = `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0`;
/** The same curve the mobile menu uses. */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * The poster, and the player it opens.
 *
 * The video plays in a lightbox rather than in place. The frame is 21:9, so an
 * inline player has to be cropped top and bottom by that frame's
 * `overflow: hidden` — in the lightbox it gets the full 16:9 it was shot in.
 *
 * The lightbox is portalled to `<body>` because the frame sits inside a
 * `Parallax` that transforms it: a `position: fixed` descendant would be
 * positioned against that transformed ancestor and clipped, not the viewport.
 *
 * Closing unmounts the iframe, which stops playback.
 */
export function WorriedVideo() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lenis = useLenis();
  const reduce = useReducedMotion();

  useEffect(() => setMounted(true), []);

  // Lock the page behind the lightbox, and hand focus back to the poster on
  // close — the same contract the mobile menu keeps.
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lenis?.stop();
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      lenis?.start();
      triggerRef.current?.focus();
    };
  }, [open, lenis]);

  // Escape closes, as with any dialog.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label="Play project video"
        aria-haspopup="dialog"
        className="worried-video-poster"
        onClick={() => setOpen(true)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://img.youtube.com/vi/${VIDEO_ID}/maxresdefault.jpg`}
          alt=""
          className="worried-video-thumb"
          loading="lazy"
        />
        <span aria-hidden className="worried-play-button">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M8.3 5.9a1 1 0 0 1 1.55-.83l7.7 5.1a1 1 0 0 1 0 1.66l-7.7 5.1a1 1 0 0 1-1.55-.83V5.9Z" />
          </svg>
        </span>
      </button>

      {mounted
        ? createPortal(
            <AnimatePresence>
              {open ? (
                <motion.div
                  className="video-lightbox"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Project marketing video"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: { duration: reduce ? 0.12 : 0.24, ease: EASE },
                  }}
                  exit={{
                    opacity: 0,
                    transition: { duration: reduce ? 0.1 : 0.18, ease: EASE },
                  }}
                  onClick={() => setOpen(false)}
                >
                  <motion.div
                    className="video-lightbox-inner"
                    initial={{ opacity: 0, scale: reduce ? 1 : 0.96 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      transition: { duration: reduce ? 0.12 : 0.3, ease: EASE },
                    }}
                    exit={{
                      opacity: 0,
                      scale: reduce ? 1 : 0.98,
                      transition: { duration: 0.16, ease: EASE },
                    }}
                    // A click on the video itself must not close the dialog.
                    onClick={(event) => event.stopPropagation()}
                  >
                    <button
                      ref={closeRef}
                      type="button"
                      onClick={() => setOpen(false)}
                      aria-label="Close video"
                      className="video-lightbox-close"
                    >
                      <svg
                        aria-hidden
                        viewBox="0 0 18 18"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      >
                        <path d="M5 5l8 8M13 5l-8 8" />
                      </svg>
                    </button>

                    <div className="video-lightbox-frame">
                      <iframe
                        className="video-lightbox-iframe"
                        src={EMBED_SRC}
                        title="Project marketing video"
                        allow="autoplay; encrypted-media; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                  </motion.div>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  );
}
