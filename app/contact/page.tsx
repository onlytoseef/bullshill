import type { Metadata } from "next";

import { ContactHero } from "@/components/sections/contact-hero";
import { ContactSchedule } from "@/components/sections/contact-schedule";
import { FinalCta } from "@/components/sections/final-cta";
import { Partners } from "@/components/sections/partners";

export const metadata: Metadata = {
  title: "Contact us",
  description:
    "Send us your query or schedule a free 30 minute Google Meet call to talk about your project.",
};

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactSchedule />
      <Partners variant="strip" />
      <FinalCta />
    </>
  );
}
