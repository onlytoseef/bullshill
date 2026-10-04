import type { Metadata } from "next";

import { BlogFeatured } from "@/components/sections/blog-featured";
import { BlogHero } from "@/components/sections/blog-hero";
import { BlogMore } from "@/components/sections/blog-more";
import { FinalCta } from "@/components/sections/final-cta";
import { Partners } from "@/components/sections/partners";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Playbooks, post-mortems and strong opinions on Web3 marketing — token launches, community building, and landing pages that convert.",
};

export default function BlogPage() {
  return (
    <>
      <BlogHero />
      <BlogFeatured />
      <BlogMore />
      <Partners showHeading={false} />
      <FinalCta />
    </>
  );
}
