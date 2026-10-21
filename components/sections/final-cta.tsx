import Image from "next/image";

import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/section";
import { finalCta } from "@/lib/content";
import { cn } from "@/lib/utils";
import contactBackground from "../../app/assets/contact -us/contact-us.webp";
import findMoreIcon from "../../app/assets/images/find-more-icon.svg";

type Props = {
  variant?: "home" | "page";
};

export function FinalCta({ variant = "home" }: Props) {
  return (
    <Section id="contact" className="bg-blue-light pb-12 sm:pb-16">
      <Container>
        <Reveal>
          <div
            className={cn(
              "final-cta-card relative isolate overflow-hidden text-center",
              variant === "page" && "final-cta-card--page",
            )}
          >
            {variant === "home" ? (
              <div
                aria-hidden
                className="final-cta-card-image pointer-events-none absolute inset-0"
                style={{ backgroundImage: `url(${contactBackground.src})` }}
              />
            ) : null}
            <h2 className="final-cta-heading relative text-balance text-white">
              {finalCta.title}
            </h2>
            <Button
              href={finalCta.cta.href}
              variant="light"
              size="lg"
              className="final-cta-button relative mt-6"
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
