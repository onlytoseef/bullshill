"use client";

import { useLenis } from "lenis/react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { ArrowIcon } from "@/components/ui/icons";
import { nav, site } from "@/lib/content";
import logo from "../../app/assets/images/logo.webp";

/** Same navy and brand orange the rest of the site uses. */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const ROW_BASE = 0.22;
const ROW_STEP = 0.07;

const LINKS = [...nav.left, ...nav.right];

/**
 * The mobile menu: a full-screen editorial overlay.
 *
 * The root *is* the scrim — it fades from transparent to the navy, which is
 * what darkens the page behind — and the panel slides up inside it. The root's
 * exit (340ms) is deliberately the longest animation in the tree: it is the
 * direct child of `AnimatePresence`, so its duration is what decides when the
 * menu unmounts, and everything else finishes inside that window.
 *
 * Routes, labels and the contact action all come from `nav`; nothing about the
 * navigation is duplicated here.
 */
export function MobileMenu({ onClose }: { onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const lenis = useLenis();
  const reduce = useReducedMotion();

  // Delay + duration, collapsed under reduced motion so the stagger and the
  // travel are gone and only a quick fade remains.
  const timing = (delay: number, duration: number) => ({
    delay: reduce ? 0 : delay,
    duration: reduce ? 0.12 : duration,
    ease: EASE,
  });
  const shift = (value: number) => (reduce ? 0 : value);

  // Lock the page behind the menu, and hand focus back to the trigger on close.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lenis?.stop();

    const trigger = document.querySelector<HTMLElement>(
      '[aria-controls="mobile-menu"]',
    );
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      lenis?.start();
      trigger?.focus();
    };
  }, [lenis]);

  // Escape closes, as with any dialog.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <motion.div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Main menu"
      className="mobile-menu lg:hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: timing(0, 0.22) }}
      exit={{ opacity: 0, transition: timing(0, 0.34) }}
    >
      <motion.div
        className="mobile-menu-panel"
        initial={{ y: reduce ? 0 : "100%" }}
        animate={{ y: 0, transition: timing(0, 0.55) }}
        exit={{ y: reduce ? 0 : "100%", transition: timing(0, 0.34) }}
      >
        <div className="mobile-menu-inner">
          <div className="mobile-menu-header">
            <motion.span
              className="mobile-menu-brand"
              initial={{ opacity: 0, y: shift(-12) }}
              animate={{ opacity: 1, y: 0, transition: timing(0.18, 0.4) }}
              exit={{ opacity: 0, transition: timing(0, 0.16) }}
            >
              <Image src={logo} alt="" width={34} height={34} />
              <span className="mobile-menu-wordmark">{site.name}</span>
            </motion.span>

            <motion.button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="mobile-menu-close"
              initial={{ opacity: 0, scale: reduce ? 1 : 0.92 }}
              animate={{ opacity: 1, scale: 1, transition: timing(0.2, 0.35) }}
              exit={{ opacity: 0, transition: timing(0, 0.16) }}
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
            </motion.button>
          </div>

          <nav aria-label="Main">
            <ul className="mobile-menu-list">
              {LINKS.map((link, index) => {
                const base = ROW_BASE + index * ROW_STEP;
                // Exit runs bottom-up: the last row leaves first.
                const outBase = (LINKS.length - 1 - index) * 0.03;

                return (
                  <li key={link.href} className="mobile-menu-row">
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="mobile-menu-link"
                    >
                      <motion.span
                        className="mobile-menu-index"
                        initial={{ opacity: 0, y: shift(22) }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          transition: timing(base, 0.42),
                        }}
                        exit={{
                          opacity: 0,
                          y: shift(10),
                          transition: timing(outBase, 0.2),
                        }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </motion.span>

                      <motion.span
                        className="mobile-menu-label"
                        initial={{ opacity: 0, y: shift(22) }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          transition: timing(base + 0.06, 0.42),
                        }}
                        exit={{
                          opacity: 0,
                          y: shift(10),
                          transition: timing(outBase, 0.2),
                        }}
                      >
                        {link.label}
                      </motion.span>

                      <motion.span
                        className="mobile-menu-arrow"
                        initial={{ opacity: 0, y: shift(22) }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          transition: timing(base + 0.09, 0.42),
                        }}
                        exit={{
                          opacity: 0,
                          y: shift(10),
                          transition: timing(outBase, 0.2),
                        }}
                      >
                        <ArrowIcon className="size-5" />
                      </motion.span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <motion.div
            className="mobile-menu-cta-wrap"
            initial={{ opacity: 0, y: shift(16) }}
            animate={{
              opacity: 1,
              y: 0,
              transition: timing(ROW_BASE + LINKS.length * ROW_STEP + 0.05, 0.45),
            }}
            exit={{ opacity: 0, transition: timing(0, 0.18) }}
          >
            <Link
              href={nav.cta.href}
              onClick={onClose}
              className="mobile-menu-cta"
            >
              <svg
                aria-hidden
                viewBox="0 0 20 20"
                fill="none"
                className="size-5 shrink-0"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 12.4A2.6 2.6 0 0 1 14.4 15H8.4L4 17.6V6.6A2.6 2.6 0 0 1 6.6 4h7.8A2.6 2.6 0 0 1 17 6.6z" />
                <path d="M7.4 8h5.2M7.4 10.6h3.2" />
              </svg>
              {nav.cta.label}
              <ArrowIcon className="mobile-menu-cta-arrow size-4" />
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
