import { Reveal } from "@/components/motion/reveal";
import { Stagger } from "@/components/motion/stagger";
import { Container, Section } from "@/components/ui/section";
import { partners } from "@/lib/content";

type Props = {
  /**
   * The /services page shows only the trusted-by line and the logos; the home
   * page carries the full heading above them.
   */
  showHeading?: boolean;
};

export function Partners({ showHeading = true }: Props) {
  return (
    <Section className="py-16 sm:py-20">
      <Container>
        <Reveal className="text-center">
          {showHeading ? (
            <h2 className="text-display-xs font-semibold text-white">
              {partners.title}
            </h2>
          ) : null}
          <p className="mt-3 text-sm text-blue-light-active">
            {partners.subtitle}
          </p>
        </Reveal>

        <Stagger
          className="mt-12 grid grid-cols-2 items-center gap-x-8 gap-y-10 sm:grid-cols-4 lg:grid-cols-7"
          stagger={0.06}
        >
          {partners.logos.map((logo) => (
            <span
              key={logo}
              /* Text stand-ins until real logo SVGs land in
                 public/assets/brand/ — swap for <Image> then. */
              className="block text-center text-base font-semibold whitespace-nowrap text-blue-light-active/50 transition-colors duration-300 hover:text-white"
            >
              {logo}
            </span>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
