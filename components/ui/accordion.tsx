"use client";

import { motion } from "motion/react";
import { useId, useState } from "react";

import { cn } from "@/lib/utils";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

type Item = {
  question: string;
  answer: string;
};

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
                className="faq-question flex w-full items-center justify-between gap-6 py-5 text-left"
              >
                <span
                  className={cn(
                    "faq-question-text transition-colors",
                    open ? "text-white" : "text-blue-light",
                  )}
                >
                  {item.question}
                </span>

                <span aria-hidden className="faq-icon">
                  <svg
                    viewBox="0 0 14 14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    className="faq-icon-glyph"
                  >
                    <path d="M2 7h10" />
                    <motion.path
                      d="M7 2v10"
                      animate={{ opacity: open ? 0 : 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  </svg>
                </span>
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
              <p className="faq-answer pb-6 text-blue-light-active">
                {item.answer}
              </p>
            </motion.div>
          </li>
        );
      })}
    </ul>
  );
}
