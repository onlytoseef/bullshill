"use client";

import { motion } from "motion/react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { nav } from "@/lib/content";

export function MobileMenu({ onClose }: { onClose: () => void }) {
  // No horizontal margin: the header already applies `px-4`, so adding `mx-4`
  // here made the panel 16px narrower per side than the nav pill it drops out
  // of.
  return (
    <motion.div
      id="mobile-menu"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden rounded-b-3xl bg-blue-light lg:hidden"
    >
      <ul className="flex flex-col gap-1 px-6 pb-6 text-blue-darker">
        {[...nav.left, ...nav.right].map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              onClick={onClose}
              className="block py-2.5 text-base text-blue-darker transition-colors hover:text-blue"
            >
              {link.label}
            </Link>
          </li>
        ))}
        <li className="pt-3">
          <Button
            href={nav.cta.href}
            onClick={onClose}
            className="w-full"
            size="md"
          >
            {nav.cta.label}
          </Button>
        </li>
      </ul>
    </motion.div>
  );
}
