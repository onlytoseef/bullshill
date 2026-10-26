"use client";

import * as React from "react";
import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react";
import type { EmblaOptionsType, EmblaPluginType } from "embla-carousel";

import { cn } from "@/lib/utils";

export type CarouselApi = UseEmblaCarouselType[1];

type CarouselContextValue = {
  viewportRef: UseEmblaCarouselType[0];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
};

const CarouselContext = React.createContext<CarouselContextValue | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("Carousel components must be used inside Carousel");
  }

  return context;
}

export function Carousel({
  opts,
  plugins,
  setApi,
  className,
  children,
  onKeyDown,
  ...props
}: React.ComponentProps<"div"> & {
  opts?: EmblaOptionsType;
  plugins?: EmblaPluginType[];
  setApi?: (api: CarouselApi) => void;
}) {
  const [viewportRef, api] = useEmblaCarousel(opts, plugins);
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  React.useEffect(() => {
    if (!api) return;

    const updateControls = () => {
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };

    updateControls();
    api.on("select", updateControls);
    api.on("reInit", updateControls);

    return () => {
      api.off("select", updateControls);
      api.off("reInit", updateControls);
    };
  }, [api]);

  React.useEffect(() => {
    setApi?.(api);
  }, [api, setApi]);

  const scrollPrev = React.useCallback(() => api?.scrollPrev(), [api]);
  const scrollNext = React.useCallback(() => api?.scrollNext(), [api]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollPrev();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollNext();
    }

    onKeyDown?.(event);
  };

  return (
    <CarouselContext.Provider
      value={{ viewportRef, scrollPrev, scrollNext, canScrollPrev, canScrollNext }}
    >
      <div
        role="region"
        aria-roledescription="carousel"
        className={cn("relative", className)}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

export function CarouselContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  const { viewportRef } = useCarousel();

  return (
    <div ref={viewportRef} className="overflow-hidden">
      <ul className={cn("flex", className)} {...props} />
    </div>
  );
}

export function CarouselItem({
  className,
  ...props
}: React.ComponentProps<"li">) {
  return <li role="group" aria-roledescription="slide" className={cn("min-w-0 shrink-0 grow-0", className)} {...props} />;
}

function CarouselArrow({ direction }: { direction: "previous" | "next" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={direction === "previous" ? "size-5 rotate-180" : "size-5"}
    >
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

export function CarouselPrevious({
  className,
  ...props
}: React.ComponentProps<"button">) {
  const { scrollPrev, canScrollPrev } = useCarousel();

  return (
    <button
      type="button"
      aria-label="Previous slide"
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      className={cn("inline-flex items-center justify-center", className)}
      {...props}
    >
      <CarouselArrow direction="previous" />
    </button>
  );
}

export function CarouselNext({
  className,
  ...props
}: React.ComponentProps<"button">) {
  const { scrollNext, canScrollNext } = useCarousel();

  return (
    <button
      type="button"
      aria-label="Next slide"
      disabled={!canScrollNext}
      onClick={scrollNext}
      className={cn("inline-flex items-center justify-center", className)}
      {...props}
    >
      <CarouselArrow direction="next" />
    </button>
  );
}
