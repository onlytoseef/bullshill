"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  type CarouselApi,
} from "@/components/ui/carousel";

export function AwardsCarousel({ children }: { children: ReactNode }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [snapCount, setSnapCount] = useState(0);
  const [autoplay] = useState(() =>
    Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true }),
  );
  const host = useRef<HTMLDivElement>(null);
  const onScreen = useRef(false);

  useEffect(() => {
    if (!api) return;

    const updateDots = () => {
      setCurrent(api.selectedScrollSnap());
      setSnapCount(api.scrollSnapList().length);
    };

    updateDots();
    api.on("select", updateDots);
    api.on("reInit", updateDots);

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

    /**
     * It only advances while the section is on screen. Autoplay used to start
     * the moment the component mounted, so the row was already several slides
     * along — and looping — by the time anyone scrolled to it.
     */
    const sync = () => {
      if (motionPreference.matches || !onScreen.current) {
        autoplay.stop();
      } else {
        autoplay.play();
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen.current = entry.isIntersecting;
        sync();
      },
      { threshold: 0 },
    );
    if (host.current) observer.observe(host.current);

    motionPreference.addEventListener("change", sync);
    sync();

    return () => {
      observer.disconnect();
      api.off("select", updateDots);
      api.off("reInit", updateDots);
      motionPreference.removeEventListener("change", sync);
    };
  }, [api, autoplay]);

  return (
    // The wrapper is what the intersection observer watches: `Carousel` does not
    // forward a ref, and the observer needs the carousel's own box.
    <div ref={host}>
      <Carousel
        className="awards-carousel"
        opts={{ align: "start", loop: true, slidesToScroll: "auto" }}
        plugins={[autoplay]}
        setApi={setApi}
        aria-label="Team members"
      >
        <CarouselContent className="awards-track">{children}</CarouselContent>
        <div className="awards-dots" aria-label="Team carousel pages">
          {Array.from({ length: snapCount }, (_, index) => (
            <button
              key={index}
              type="button"
              className="awards-dot"
              aria-label={`Go to team page ${index + 1}`}
              aria-current={index === current ? "true" : undefined}
              onClick={() => api?.scrollTo(index)}
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
}
