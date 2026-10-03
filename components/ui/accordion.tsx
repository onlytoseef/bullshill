"use client";

import { motion } from "motion/react";
import { useId, useState } from "react";

import { cn } from "@/lib/utils";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

type Item = {
  question: string;
  answer: string;
};

/**
 * Single-open accordion.
 *
 * Takes plain strings, so a Server Component can hand it content straight from
 * `lib/content` without anything unserializable crossing the boundary.
 *
 * Every panel stays mounted and is collapsed with height rather than being
 * unmounted. Mounting on open would leave the closed answers out of the
 * rendered HTML entirely — they'd appear only inside the RSC payload, which is
 * JSON in a script tag and not indexable as page content. FAQ copy is worth too
 * much in search to hide that way. `inert` then keeps the collapsed text out of
 * the tab order and the accessibility tree, so screen readers don't read
 * answers the user hasn't opened.
 */
export function Accordion({ items }: { items: readonly Item[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  return (
    <ul className="divide-y divide-surface-border border-y border-surface-border">
      {items.map((item, index) => {
        const open = openIndex === index;
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;

        return (
          <li key={item.question}>
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? null : index)}
                className="flex w-full items-center justify-between gap-6 py-5 text-left"
              >
                <span
                  className={cn(
                    "text-base font-medium transition-colors",
                    open ? "text-white" : "text-blue-light",
                  )}
                >
                  {item.question}
                </span>

                <motion.span
                  aria-hidden
                  animate={{ rotate: open ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="grid size-7 shrink-0 place-items-center rounded-full border border-surface-border text-orange"
                >
                  <svg
                    viewBox="0 0 14 14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    className="size-3.5"
                  >
                    <path d="M7 2v10M2 7h10" />
                  </svg>
                </motion.span>
              </button>
            </h3>

            <motion.div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              inert={!open}
              initial={false}
              animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
              transition={{ duration: 0.28, ease: EASE_OUT }}
              className="overflow-hidden"
            >
              <p className="pb-6 text-sm leading-relaxed text-blue-light-active">
                {item.answer}
              </p>
            </motion.div>
          </li>
        );
      })}
    </ul>
  );
}
