import Image from "next/image";

import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/section";
import { finalCta } from "@/lib/content";
import contactBackground from "../../app/assets/contact -us/contact-us.png";
import findMoreIcon from "../../app/assets/images/find-more-icon.svg";

/**
 * Closing call to action: a dark card sitting on the page's light bottom
 * region, which continues into the footer.
 */
export function FinalCta() {
  return (
    <Section id="contact" className="bg-blue-light pb-12 sm:pb-16">
      <Container>
        <Reveal>
          <div
            className="final-cta-card relative isolate overflow-hidden text-center"
          >
            <div
              aria-hidden
              className="final-cta-card-image pointer-events-none absolute inset-0"
              style={{ backgroundImage: `url(${contactBackground.src})` }}
            />
            <h2 className="final-cta-heading relative text-balance text-white">
              {finalCta.title}
            </h2>
            <Button
              href={finalCta.cta.href}
              variant="light"
              size="lg"
              className="final-cta-button relative mt-8"
            >
              {finalCta.cta.label}
              <Image src={findMoreIcon} alt="" width={24} height={24} />
            </Button>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
