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
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { nav, site } from "@/lib/content";
import { cn } from "@/lib/utils";
import logo from "../../app/assets/images/logo.png";
import heroBackground from "../../app/assets/images/hero-bg.svg";

const loadMobileMenu = () => import("./mobile-menu");

const MobileMenu = dynamic(
  () => loadMobileMenu().then((module) => module.MobileMenu),
  { ssr: false },
);

const preloadMobileMenu = () => {
  void loadMobileMenu();
};

const linkClass =
  "text-[13px] font-medium text-blue-darker transition-colors hover:text-blue";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const ownBackdrop = pathname === "/";

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  const close = () => setMenuOpen(false);

  return (
    <header
      className="site-header sticky top-0 z-50 px-4 pt-5 md:px-7"
      style={{
        backgroundImage:
          scrolled || !ownBackdrop ? "none" : `url(${heroBackground.src})`,
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
          aria-label="Bullshill home"
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
            className="nav-contact-button"
          >
            {nav.cta.label}
            <svg aria-hidden viewBox="0 0 20 20" className="size-5 shrink-0">
              <path
                fill="currentColor"
                d="M6.5 2.5h7A4.5 4.5 0 0 1 18 7v4.5a4.5 4.5 0 0 1-4.5 4.5H8.2l-3.1 2.3c-.5.4-1.1 0-1.1-.6V14.9A4.5 4.5 0 0 1 2 11.5V7a4.5 4.5 0 0 1 4.5-4.5Z"
              />
              <path
                d="M7.5 9.25h5"
                fill="none"
                stroke="#08121e"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
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
