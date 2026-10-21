"use client";

import { useEffect, useState, type ReactNode } from "react";
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
    const updateAutoplay = () => {
      if (motionPreference.matches) {
        autoplay.stop();
      } else {
        autoplay.play();
      }
    };

    updateAutoplay();
    motionPreference.addEventListener("change", updateAutoplay);

    return () => {
      api.off("select", updateDots);
      api.off("reInit", updateDots);
      motionPreference.removeEventListener("change", updateAutoplay);
    };
  }, [api, autoplay]);

  return (
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
  );
}
