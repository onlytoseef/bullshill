"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useState, type CSSProperties } from "react";

import { Button } from "@/components/ui/button";
import { ChatIcon } from "@/components/ui/icons";
import { LogoMark } from "@/components/ui/logo-mark";
import { nav, site } from "@/lib/content";
import { cn } from "@/lib/utils";

const loadMobileMenu = () => import("./mobile-menu");

const MobileMenu = dynamic(
  () => loadMobileMenu().then((module) => module.MobileMenu),
  { ssr: false },
);

const preloadMobileMenu = () => {
  void loadMobileMenu();
};

/**
 * Nav link with an automatic shine sweep and an orange hover/focus state.
 *
 * The dark label is the base; the second (arial-hidden) copy sits on top and
 * carries the gradient-clipped shine band. `--shine-index` staggers its sweep
 * across the nav (180ms per link).
 */
function NavLink({
  href,
  label,
  index,
}: {
  href: string;
  label: string;
  index: number;
}) {
  return (
    <Link
      href={href}
      className="nav-link"
      style={{ "--shine-index": index } as CSSProperties}
    >
      <span className="nav-link__text">
        <span className="nav-link__label">{label}</span>
        <span className="nav-link__shine" aria-hidden="true">
          {label}
        </span>
      </span>
      <span className="nav-link__underline" aria-hidden="true" />
    </Link>
  );
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  const close = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      if (desktop.matches) close();
    };
    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, [close]);

  return (
    <header className="site-header sticky top-0 z-50 mx-auto w-[calc(100%-2rem)] max-w-[71.25rem] pt-5 md:w-[calc(100%-3.5rem)]">
      <nav
        aria-label="Main"
        className={cn(
          "relative mx-auto flex h-[4.25rem] max-w-[71.25rem] items-center rounded-full bg-blue-light px-5 text-blue-darker shadow-[0_0.625rem_1.875rem_rgba(8,18,30,0.14)] transition-shadow duration-300 md:px-6",
          scrolled && "shadow-[0_0.75rem_2.125rem_rgba(8,18,30,0.24)]",
        )}
      >
        <ul className="hidden flex-1 items-center gap-7 lg:flex">
          {nav.left.map((link, index) => (
            <li key={link.href}>
              <NavLink href={link.href} label={link.label} index={index} />
            </li>
          ))}
        </ul>

        <Link
          href="/"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          aria-label="Bullshill home"
        >
          <span className="flex items-center gap-2">
            <LogoMark className="size-[3.25rem] shrink-0" />
            <span className="header-wordmark">
              {site.name}
            </span>
          </span>
        </Link>

        <div className="hidden flex-1 items-center justify-end gap-7 lg:flex">
          <ul className="flex items-center gap-7">
            {nav.right.map((link, index) => (
              <li key={link.href}>
                <NavLink
                  href={link.href}
                  label={link.label}
                  index={nav.left.length + index}
                />
              </li>
            ))}
          </ul>
          <Button
            href={nav.cta.href}
            variant="primary"
            size="sm"
            className="nav-contact-button"
          >
            {nav.cta.label}
            <ChatIcon />
          </Button>
        </div>

        <button
          type="button"
          onPointerEnter={preloadMobileMenu}
          onTouchStart={preloadMobileMenu}
          onFocus={preloadMobileMenu}
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
        {menuOpen ? <MobileMenu key="mobile-menu" onClose={close} /> : null}
      </AnimatePresence>
    </header>
  );
}
