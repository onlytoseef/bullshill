import Link from "next/link";

import { Parallax } from "@/components/motion/parallax";
import { Reveal } from "@/components/motion/reveal";
import { SocialIcon } from "@/components/ui/social-icons";
import { Container } from "@/components/ui/section";
import { Wordmark } from "@/components/ui/wordmark";
import { footer } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="site-footer bg-blue-light text-blue-darker">
      <Container>
        <div className="flex flex-col items-center text-center">
          <Wordmark className="footer-wordmark text-blue-darker" />

          <p className="footer-description mt-5 max-w-2xl">
            {footer.description}
          </p>

          <ul className="footer-socials mt-7 flex items-center">
            {footer.socials.map((social) => (
              <li key={social.label}>
                <Link
                  href={social.href}
                  aria-label={social.label}
                  className="footer-social-link grid place-items-center rounded-full bg-white text-blue-darker transition-colors hover:bg-[#e8750a] hover:text-white"
                >
                  <SocialIcon name={social.label} />
                </Link>
              </li>
            ))}
          </ul>

          {/* TODO: no submit handler yet — point this at a mailing-list
              endpoint or a Server Action before launch. */}
          <form className="footer-newsletter mt-8 w-full">
            <div className="footer-newsletter-row flex flex-col gap-2 sm:flex-row sm:items-center">
              <label htmlFor="footer-name" className="sr-only">
                {footer.newsletter.name.label}
              </label>
              <input
                id="footer-name"
                name="name"
                type="text"
                placeholder={footer.newsletter.name.placeholder}
                className="footer-newsletter-input h-11 min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-blue-light-active/70 focus:outline-none"
              />

              <span
                aria-hidden
                className="footer-newsletter-divider hidden h-6 w-px shrink-0 sm:block"
              />

              <label htmlFor="footer-email" className="sr-only">
                {footer.newsletter.email.label}
              </label>
              <input
                id="footer-email"
                name="email"
                type="email"
                required
                placeholder={footer.newsletter.email.placeholder}
                className="footer-newsletter-input h-11 min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-blue-light-active/70 focus:outline-none"
              />

              <button
                type="submit"
                className="footer-newsletter-button shrink-0 transition-colors"
              >
                {footer.newsletter.button}
              </button>
            </div>
          </form>
        </div>
      </Container>

      {/* Oversized wordmark. Decorative — the real one is at the top of the
          footer, so this is hidden from assistive tech. */}
      <Reveal y={40} duration={0.9} className="mt-14">
        <Parallax amount={6}>
          <div aria-hidden className="overflow-hidden px-6">
            <p className="footer-oversized-wordmark text-center select-none">
              BULLSHILL<span className="text-blue-light-active">.</span>
            </p>
          </div>
        </Parallax>
      </Reveal>

      <Container>
        <div className="flex flex-col items-center gap-4 border-t border-blue-light-active/50 py-6 text-xs text-blue-dark/70 sm:flex-row sm:justify-between">
          <p>{footer.legal}</p>

          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {footer.legalLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-blue-darker"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
