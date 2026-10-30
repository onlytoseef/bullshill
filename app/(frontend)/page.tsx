import type { Metadata } from "next";

import { Awards } from "@/components/sections/awards";
import { Blog } from "@/components/sections/blog";
import { Faqs } from "@/components/sections/faqs";
import { FinalCta } from "@/components/sections/final-cta";
import { Hero } from "@/components/sections/hero";
import { Intro } from "@/components/sections/intro";
import { Partners } from "@/components/sections/partners";
import { Process } from "@/components/sections/process";
import { Projects } from "@/components/sections/projects";
import { Services } from "@/components/sections/services";
import { Testimonials } from "@/components/sections/testimonials";
import { Worried } from "@/components/sections/worried";
import { pageMetadata } from "@/lib/seo";

/**
 * The home page sets its own metadata rather than inheriting the layout's, so
 * it gets a self-referencing canonical like every other route. `absolute`
 * because the default title already carries the brand.
 */
export const metadata: Metadata = pageMetadata({
  title: "Bullshill — Marketing Built for Web3 Success",
  description:
    "Data-driven, end-to-end marketing for crypto and Web3 projects. Token launches, community building, and campaigns that convert.",
  path: "/",
  absolute: true,
});

export default function Page() {
  return (
    <>
      <Hero />
      <Intro />
      <Services />
      <Worried />
      <Process />
      <Partners />
      <Testimonials />
      <Projects />
      <Blog />
      
      <Awards />
      <Faqs />
      <FinalCta />
    </>
  );
}
