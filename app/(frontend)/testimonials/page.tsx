import type { Metadata } from "next";

import { ParticleBackground } from "@/components/motion/particle-background";
import { FinalCta } from "@/components/sections/final-cta";
import { ReviewsHero } from "@/components/sections/reviews-hero";
import { ReviewsWall } from "@/components/sections/reviews-wall";
import { reviewsPage } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Client Reviews",
  description: reviewsPage.meta,
  path: "/testimonials",
});

export default function TestimonialsPage() {
  return (
    // One particle canvas for the whole page, following the same opt-in
    // contract the home sections use — never one scene per review.
    <div className="has-particles reviews-page">
      <ParticleBackground />

      <div className="reviews-page-content">
        <ReviewsHero />
        <ReviewsWall />
        <FinalCta variant="page" />
      </div>
    </div>
  );
}
