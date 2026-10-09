"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { nav, site } from "@/lib/content";
import { cn } from "@/lib/utils";
import logo from "../../app/assets/images/logo.png";
import heroBackground from "../../app/assets/images/hero-bg.svg";

const linkClass =
  "text-[13px] font-medium text-blue-darker transition-colors hover:text-blue";

/**
 * Sticky navigation. Transparent over the hero, then picks up a blurred
 * background and hairline border once the page scrolls.
 *
 * Sticky works here because Lenis runs in `root` mode — it scrolls the document
 * rather than transforming a wrapper, which would otherwise break the
 * containing block.
 */
export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  const close = () => setMenuOpen(false);

  return (
    <header
      className="site-header sticky top-0 z-50 px-4 pt-5 md:px-7"
      style={{
        backgroundImage: scrolled ? "none" : `url(${heroBackground.src})`,
      }}
    >
      <nav
        aria-label="Main"
        className={cn(
          "relative mx-auto flex h-[68px] max-w-[1140px] items-center rounded-full bg-blue-light px-5 text-blue-darker shadow-[0_10px_30px_rgba(8,18,30,0.14)] transition-shadow duration-300 md:px-6",
          scrolled && "shadow-[0_12px_34px_rgba(8,18,30,0.24)]",
        )}
      >
        <ul className="hidden flex-1 items-center gap-7 lg:flex">
          {nav.left.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={linkClass}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          aria-label="BullShill home"
        >
          <span className="flex items-center gap-2">
            <Image
              src={logo}
              alt=""
              width={29}
              height={29}
              priority
              className="size-7 object-contain"
            />
            <span className="text-xl font-semibold tracking-tight">
              {site.name}
            </span>
          </span>
        </Link>

        <div className="hidden flex-1 items-center justify-end gap-7 lg:flex">
          <ul className="flex items-center gap-7">
            {nav.right.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Button
            href={nav.cta.href}
            variant="inverse"
            size="sm"
            className="h-11 gap-4 px-5 text-sm font-normal text-blue-light hover:bg-blue-dark"
          >
            {nav.cta.label}
            <svg aria-hidden viewBox="0 0 20 20" className="size-4 fill-current">
              <path d="M4.5 4.75A2.75 2.75 0 0 1 7.25 2h5.5a2.75 2.75 0 0 1 2.75 2.75v3.5A2.75 2.75 0 0 1 12.75 11H10l-3.35 2.5V11h-.4A2.75 2.75 0 0 1 3.5 8.25v-3.5h1Zm1.5 1.5v1h6v-1H6Zm0 2v1h4v-1H6Z" />
            </svg>
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="ml-auto -mr-2 grid size-10 shrink-0 place-items-center rounded-full text-blue-darker lg:hidden"
        >
          <span className="relative block h-4 w-5">
            <motion.span
              className="absolute left-0 block h-0.5 w-full rounded-full bg-current"
              animate={menuOpen ? { top: 7, rotate: 45 } : { top: 2, rotate: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="absolute left-0 block h-0.5 w-full rounded-full bg-current"
              animate={
                menuOpen ? { top: 7, rotate: -45 } : { top: 12, rotate: 0 }
              }
              transition={{ duration: 0.2 }}
            />
          </span>
        </button>
      </nav>

      <AnimatePresence initial={false}>
        {menuOpen ? (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="mx-4 overflow-hidden rounded-b-3xl bg-blue-light lg:hidden"
          >
            <ul className="flex flex-col gap-1 px-6 pb-6 text-blue-darker">
              {[...nav.left, ...nav.right].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={close}
                    className="block py-2.5 text-base text-blue-darker transition-colors hover:text-blue"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="pt-3">
                <Button
                  href={nav.cta.href}
                  onClick={close}
                  className="w-full"
                  size="md"
                >
                  {nav.cta.label}
                </Button>
              </li>
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
