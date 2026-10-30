"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import { flushSync } from "react-dom";

import { Button } from "@/components/ui/button";
import { caseStudyImages } from "@/components/ui/case-study-row";
import { ParticleBackground } from "@/components/motion/particle-background";
import { SectionHeading } from "@/components/ui/section-heading";
import { Container, Section } from "@/components/ui/section";
import { caseStudiesPage, projects } from "@/lib/content";
import { Flip, gsap, useGSAP } from "@/lib/gsap";
import { EASE_OUT_GSAP } from "@/lib/motion";
import { replayOnScroll } from "@/lib/scroll-replay";
import { cn } from "@/lib/utils";
import findMoreIcon from "../../app/assets/images/find-more-icon.svg";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/**
 * The "Our work" tabs.
 *
 * Animation hooks, all resolved inside this section:
 * - `[data-work-reveal]` — header, tab row and panel; staggered in on scroll.
 * - `[data-work-pill]`   — the filled oval behind the selected tab.
 * - `[data-work-swap]`   — the panel's text block and graphic; swapped on click.
 *
 * Selection is two pieces of state on purpose: `selected` moves the pill and
 * `aria-selected` the moment a tab is clicked, while `shown` is the content on
 * screen, which only changes once the old content has animated out.
 */
export function Projects() {
  const root = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState(0);
  const [shown, setShown] = useState(0);
  // Refs, not state, for anything read from timeline callbacks: those run
  // long after the render whose closure they captured.
  const selectedRef = useRef(0);
  const switching = useRef<gsap.core.Timeline | null>(null);
  const queued = useRef<number | null>(null);
  const baseId = useId();
  const panelId = `${baseId}-panel`;
  const current = caseStudiesPage.items[shown];
  const image = caseStudyImages[current.slug];

  const { contextSafe } = useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Paused and replayed every time the section comes back into view,
        // rather than fired once off a ScrollTrigger — see `lib/scroll-replay`.
        const reveal = gsap.from(
          gsap.utils.toArray<HTMLElement>("[data-work-reveal]", el),
          {
            y: 20,
            opacity: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: EASE_OUT_GSAP,
            paused: true,
          },
        );

        return replayOnScroll(el, {
          // The bottom edge matches the old `top 80%` start.
          rootMargin: "-20% 0px",
          play: () => reveal.restart(),
          reset: () => reveal.pause(0),
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  /**
   * Always entered through `contextSafe` (see the tabs' `onClick`), so
   * everything it starts belongs to the `useGSAP` context and is killed and
   * reverted on unmount. That includes the queued re-run from `onComplete`:
   * GSAP runs callbacks inside the context their animation was created in.
   */
  function select(index: number) {
    // The active-animation check: one switch at a time. A click that lands
    // mid-switch is held, and the latest one runs as soon as this one is done.
    if (switching.current?.isActive()) {
      queued.current = index;
      return;
    }
    queued.current = null;
    if (index === selectedRef.current) return;
    selectedRef.current = index;

    const el = root.current;
    if (!el || window.matchMedia(REDUCED_MOTION).matches) {
      setSelected(index);
      setShown(index);
      return;
    }

    // FLIP: record where the pill is, let React move it into the new tab, then
    // play it back from the old spot. One read before the DOM write and one
    // after; the slide itself is transform-only — every tab is the same size,
    // so `scale` stays at 1 and the oval never distorts.
    const pillState = Flip.getState(el.querySelector("[data-work-pill]"));
    flushSync(() => setSelected(index));
    Flip.from(pillState, {
      targets: el.querySelector("[data-work-pill]"),
      duration: 0.5,
      ease: "power3.inOut",
      scale: true,
    });

    // React keeps the same two nodes and only swaps what is inside them, so
    // one set of targets covers both halves of the switch.
    const swap = gsap.utils.toArray<HTMLElement>("[data-work-swap]", el);

    switching.current = gsap
      .timeline({
        onComplete: () => {
          switching.current = null;
          const next = queued.current;
          queued.current = null;
          if (next !== null) select(next);
        },
      })
      .to(swap, { x: -20, opacity: 0, duration: 0.25, ease: "power2.in" })
      .add(() => flushSync(() => setShown(index)))
      .fromTo(
        swap,
        { x: 20, opacity: 0, scale: 0.98 },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 0.45,
          ease: "power2.out",
          stagger: 0.06,
          // fromTo renders its start state on creation by default — which
          // would hide the old content before it had even begun to leave.
          immediateRender: false,
        },
      );
  }

  return (
    <Section id="projects" className="projects-section has-particles">
      <ParticleBackground />
      <Container>
        <div ref={root}>
          <div data-work-reveal>
            <SectionHeading
              eyebrow={projects.eyebrow}
              title={projects.title}
              reveal={false}
              className="projects-heading"
            />
          </div>

          <div
            data-work-reveal
            role="tablist"
            aria-label="Case studies"
            className="project-tabs flex flex-wrap justify-center"
          >
            {caseStudiesPage.items.map((study, index) => {
              const isSelected = index === selected;

              return (
                <button
                  key={study.slug}
                  type="button"
                  role="tab"
                  id={`${baseId}-tab-${index}`}
                  aria-selected={isSelected}
                  aria-controls={panelId}
                  aria-label={study.client}
                  onClick={() => contextSafe(select)(index)}
                  className={cn(
                    "project-tab relative text-sm font-medium transition-colors",
                    isSelected ? "project-tab-active text-blue-darker" : "text-blue-light-active hover:text-white",
                  )}
                >
                  {isSelected ? (
                    <span
                      data-work-pill
                      data-flip-id="work-pill"
                      className="project-tab-active-fill absolute inset-0 rounded-full"
                    />
                  ) : null}
                  <span className="relative">{study.slug.toUpperCase()}</span>
                </button>
              );
            })}
          </div>

          <div
            data-work-reveal
            id={panelId}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-${shown}`}
            className="project-panel grid gap-8"
          >
            <div data-work-swap>
              <h3 className="project-title">{current.client}</h3>
              <p className="project-body mt-4">
                {current.summaryLead}
                {current.summaryRest}
              </p>
              <Button
                href={`/case-studies/${current.slug}`}
                variant="light"
                size="sm"
                className="project-study-button cta-hover find-more-cta mt-8"
              >
                Study More
                <Image src={findMoreIcon} alt="" width={20} height={20} />
              </Button>
            </div>

            <div data-work-swap className="project-panel-visual">
              <div className="project-image relative w-full overflow-hidden">
                {image ? (
                  <Image
                    src={image}
                    alt={current.client}
                    width={image.width}
                    height={image.height}
                    sizes="(min-width: 1024px) 360px, 100vw"
                    className="block h-auto w-full"
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
