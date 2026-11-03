"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { ChatIcon } from "@/components/ui/icons";
import { nav, site } from "@/lib/content";
import { cn } from "@/lib/utils";
import logo from "../../app/assets/images/logo.webp";

const loadMobileMenu = () => import("./mobile-menu");

const MobileMenu = dynamic(
  () => loadMobileMenu().then((module) => module.MobileMenu),
  { ssr: false },
);

const preloadMobileMenu = () => {
  void loadMobileMenu();
};

const linkClass =
  "text-[0.8125rem] font-medium text-blue-darker transition-colors hover:text-blue";

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
          aria-label="Bullshill home"
        >
          <span className="flex items-center gap-2">
            <Image
              src={logo}
              alt=""
              width={29}
              height={29}
              preload
              className="size-7 object-contain"
            />
            <span className="header-wordmark">
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
