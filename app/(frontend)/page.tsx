import type { Metadata } from "next";
import { PageJsonLd } from "@/components/seo/page-json-ld";

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
 * Served as a cached static page, refreshed in the background.
 *
 * This was `force-dynamic`, which rebuilt the whole document on every single
 * request — the largest single contributor to TTFB and therefore to LCP. The
 * page has no per-visitor data, so there is nothing dynamic to preserve. The
 * blog listing inside it is already cached and tagged, and the CMS hooks call
 * `revalidatePath("/")`, so a published or unpublished post appears on the next
 * request rather than waiting for this window. Kept in step with `REVALIDATE`
 * in `lib/cms/posts.ts`.
 */
export const revalidate = 60;

/**
 * The home page sets its own metadata rather than inheriting the layout's, so
 * it gets a self-referencing canonical like every other route. `absolute`
 * because the default title already carries the brand.
 */
export const metadata: Metadata = {
  ...pageMetadata({
  title: "Bullshill — Marketing Built for Web3 Success",
  description:
    "Data-driven, end-to-end marketing for crypto and Web3 projects. Token launches, community building, and campaigns that convert.",
  path: "/",
  absolute: true,
  }),
  verification: {
    google: "T82o5OSdxv5-lSkXmLto_MXLISO-4G8Gi6GbOR1zk0o",
  },
};

export default function Page() {
  return (
    <>
      <PageJsonLd path="/" name="Bullshill — Marketing Built for Web3 Success" description={metadata.description ?? undefined} />
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
