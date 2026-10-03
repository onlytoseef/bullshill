"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { PlaceholderVisual } from "@/components/ui/placeholder-visual";
import { SectionHeading } from "@/components/ui/section-heading";
import { Container, Section } from "@/components/ui/section";
import { projects } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Filterable work showcase.
 *
 * Client Component — it owns the selected-tab state. Implemented as a real
 * tablist so arrow-key semantics and screen-reader announcements come for free.
 */
export function Projects() {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const current = projects.items[active];

  return (
    <Section id="projects">
      <Container>
        <SectionHeading
          eyebrow={projects.eyebrow}
          title={projects.title}
          className="mb-12"
        />

        <div
          role="tablist"
          aria-label="Project categories"
          className="flex flex-wrap justify-center gap-2"
        >
          {projects.items.map((item, index) => {
            const selected = index === active;

            return (
              <button
                key={item.category}
                type="button"
                role="tab"
                id={`${baseId}-tab-${index}`}
                aria-selected={selected}
                aria-controls={`${baseId}-panel-${index}`}
                onClick={() => setActive(index)}
                className={cn(
                  "relative rounded-full px-5 py-2.5 text-sm font-medium transition-colors",
                  selected ? "text-white" : "text-blue-light-active hover:text-white",
                )}
              >
                {selected ? (
                  // Shared layoutId slides the pill between tabs rather than
                  // popping it in and out.
                  <motion.span
                    layoutId="project-filter-pill"
                    className="absolute inset-0 rounded-full bg-orange"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                ) : null}
                <span className="relative">{item.category}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.category}
              id={`${baseId}-panel-${active}`}
              role="tabpanel"
              aria-labelledby={`${baseId}-tab-${active}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="grid gap-8 rounded-3xl border border-surface-border bg-surface-card p-6 sm:p-10 lg:grid-cols-2 lg:items-center lg:gap-14"
            >
              <div>
                <p className="text-sm font-medium text-orange">
                  {current.category}
                </p>
                <h3 className="mt-3 text-display-xs font-semibold text-white sm:text-display-sm">
                  {current.title}
                </h3>
                <p className="mt-4 text-base text-blue-light-active">
                  {current.body}
                </p>
                <Button href="#contact" variant="secondary" size="sm" className="mt-8">
                  Read more
                </Button>
              </div>

              <PlaceholderVisual
                label={current.visual.label}
                from={current.visual.from}
                to={current.visual.to}
                className="aspect-[4/3] w-full"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </Container>
    </Section>
  );
}
