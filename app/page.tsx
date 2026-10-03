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
import { Stats } from "@/components/sections/stats";
import { Testimonials } from "@/components/sections/testimonials";
import { Worried } from "@/components/sections/worried";

export default function Page() {
  return (
    <>
      <Hero />
      <Intro />
      <Stats />
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
