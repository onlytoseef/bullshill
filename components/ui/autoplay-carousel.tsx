"use client";

import Autoplay from "embla-carousel-autoplay";
import { useEffect, useRef, useState, type ReactNode } from "react";

import {
  Carousel,
  CarouselContent,
  type CarouselApi,
} from "@/components/ui/carousel";

type Props = {
  children: ReactNode;
  label: string;
  pageLabel: string;
  className: string;
  trackClassName: string;
  paused?: boolean;
};

/** Shared swipe, looping autoplay and pagination for team and review cards. */
export function AutoplayCarousel({
  children,
  label,
  pageLabel,
  className,
  trackClassName,
  paused = false,
}: Props) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [snapCount, setSnapCount] = useState(0);
  const [mobile, setMobile] = useState(false);
  const [autoplay] = useState(() =>
    Autoplay({
      delay: 4000,
      playOnInit: false,
      stopOnInteraction: true,
      stopOnMouseEnter: true,
      stopOnFocusIn: true,
    }),
  );
  const host = useRef<HTMLDivElement>(null);
  const onScreen = useRef(false);

  useEffect(() => {
    if (!api) return;
    const mobileViewport = window.matchMedia("(max-width: 767px)");
    const updateDots = () => {
      setCurrent(api.selectedScrollSnap());
      setSnapCount(api.scrollSnapList().length);
      setMobile(mobileViewport.matches);
    };
    updateDots();
    api.on("select", updateDots);
    api.on("reInit", updateDots);
    mobileViewport.addEventListener("change", updateDots);
    return () => {
      api.off("select", updateDots);
      api.off("reInit", updateDots);
      mobileViewport.removeEventListener("change", updateDots);
    };
  }, [api]);

  useEffect(() => {
    if (!api) return;
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hoverPreference = window.matchMedia("(hover: hover)");
    const node = host.current;
    const sync = () => {
      const hovered = hoverPreference.matches && node?.matches(":hover");
      const focused = node?.contains(document.activeElement);
      if (paused || motionPreference.matches || !onScreen.current || document.hidden || hovered || focused) {
        autoplay.stop();
      } else {
        autoplay.play();
      }
    };
    // Resume through the same visibility/preference checks after interaction.
    // The plugin must not restart itself while a review viewer is open.
    const afterInteraction = () => queueMicrotask(sync);
    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen.current = entry.isIntersecting;
        sync();
      },
      { threshold: 0 },
    );
    if (host.current) observer.observe(host.current);
    motionPreference.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    node?.addEventListener("mouseleave", afterInteraction);
    node?.addEventListener("focusout", afterInteraction);
    api.on("pointerUp", afterInteraction);
    api.on("reInit", sync);
    sync();
    return () => {
      autoplay.stop();
      observer.disconnect();
      motionPreference.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      node?.removeEventListener("mouseleave", afterInteraction);
      node?.removeEventListener("focusout", afterInteraction);
      api.off("pointerUp", afterInteraction);
      api.off("reInit", sync);
    };
  }, [api, autoplay, paused]);

  // Show the current page and its neighbours on phones. The window follows
  // swipes and autoplay, so later slides still get their own clickable dots.
  const dotCount = mobile ? Math.min(4, snapCount) : snapCount;
  const firstDot = mobile
    ? Math.max(0, Math.min(current - 1, snapCount - dotCount))
    : 0;

  return (
    <div ref={host}>
      <Carousel
        className={className}
        opts={{ align: "start", loop: true, slidesToScroll: "auto" }}
        plugins={[autoplay]}
        setApi={setApi}
        aria-label={label}
        tabIndex={0}
      >
        <CarouselContent className={trackClassName}>{children}</CarouselContent>
        <div className="carousel-dots" aria-label={`${label} carousel pages`}>
          {Array.from({ length: dotCount }, (_, offset) => {
            const index = firstDot + offset;
            return (
              <button
                key={index}
                type="button"
                className="carousel-dot"
                aria-label={`Go to ${pageLabel} page ${index + 1}`}
                aria-current={index === current ? "true" : undefined}
                onClick={() => api?.scrollTo(index)}
              />
            );
          })}
        </div>
      </Carousel>
    </div>
  );
}
