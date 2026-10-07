"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { PlaceholderVisual } from "@/components/ui/placeholder-visual";
import { SectionHeading } from "@/components/ui/section-heading";
import { Container, Section } from "@/components/ui/section";
import { projects } from "@/lib/content";
import { cn } from "@/lib/utils";
import findMoreIcon from "../../app/assets/images/find-more-icon.svg";

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
    <Section id="projects" className="projects-section">
      <Container>
        <SectionHeading
          eyebrow={projects.eyebrow}
          title={projects.title}
          className="projects-heading mb-12"
        />

        <div
          role="tablist"
          aria-label="Project categories"
          className="project-tabs flex flex-wrap justify-center"
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
                  "project-tab relative text-sm font-medium transition-colors",
                  selected ? "project-tab-active text-blue-darker" : "text-blue-light-active hover:text-white",
                )}
              >
                {selected ? (
                  // Shared layoutId slides the pill between tabs rather than
                  // popping it in and out.
                  <motion.span
                    layoutId="project-filter-pill"
                    className="project-tab-active-fill absolute inset-0 rounded-full"
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
              className="project-panel grid gap-8 p-6 sm:p-10 lg:grid-cols-2 lg:items-center lg:gap-14"
            >
              <div>
                <h3 className="project-title">
                  {current.title}
                </h3>
                <p className="project-body mt-4">
                  {current.body}
                </p>
                <Button href="#contact" variant="light" size="sm" className="project-study-button mt-8">
                  Study More
                  <Image src={findMoreIcon} alt="" width={20} height={20} />
                </Button>
              </div>

              <PlaceholderVisual
                label={current.visual.label}
                from={current.visual.from}
                to={current.visual.to}
                className="project-image w-full"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </Container>
    </Section>
  );
}
