"use client";

import type { ReactNode } from "react";

import { AutoplayCarousel } from "@/components/ui/autoplay-carousel";

export function AwardsCarousel({ children }: { children: ReactNode }) {
  return (
    <AutoplayCarousel
      label="Team members"
      pageLabel="team"
      className="awards-carousel"
      trackClassName="awards-track"
    >
      {children}
    </AutoplayCarousel>
  );
}
