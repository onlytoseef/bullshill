import Link from "next/link";

import { Parallax } from "@/components/motion/parallax";
import { Reveal } from "@/components/motion/reveal";
import { SocialIcon } from "@/components/ui/social-icons";
import { Container } from "@/components/ui/section";
import { Wordmark } from "@/components/ui/wordmark";
import { footer } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="bg-blue-light pt-8 text-blue-darker">
      <Container>
        <div className="flex flex-col items-center text-center">
          <Wordmark className="text-2xl text-blue-darker" />

          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-blue-dark/70">
            {footer.description}
          </p>

          <ul className="mt-7 flex items-center gap-3">
            {footer.socials.map((social) => (
              <li key={social.label}>
                <Link
                  href={social.href}
                  aria-label={social.label}
                  className="grid size-9 place-items-center rounded-full bg-blue-darker text-white transition-colors hover:bg-blue"
                >
                  <SocialIcon name={social.label} />
                </Link>
              </li>
            ))}
          </ul>

          {/* TODO: no submit handler yet — point this at a mailing-list
              endpoint or a Server Action before launch. */}
          <form className="mt-8 w-full max-w-xl">
            <div className="flex flex-col gap-2 rounded-3xl bg-blue-darker p-2 sm:flex-row sm:items-center sm:rounded-full">
              <label htmlFor="footer-name" className="sr-only">
                {footer.newsletter.name.label}
              </label>
              <input
                id="footer-name"
                name="name"
                type="text"
                placeholder={footer.newsletter.name.placeholder}
                className="h-11 min-w-0 flex-1 rounded-full bg-transparent px-5 text-sm text-white placeholder:text-blue-light-active/70 focus:outline-none"
              />

              <span
                aria-hidden
                className="hidden h-6 w-px shrink-0 bg-white/15 sm:block"
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
                className="h-11 min-w-0 flex-1 rounded-full bg-transparent px-5 text-sm text-white placeholder:text-blue-light-active/70 focus:outline-none"
              />

              <button
                type="submit"
                className="h-11 shrink-0 rounded-full bg-blue px-6 text-sm font-medium text-white transition-colors hover:bg-blue-hover"
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
            <p className="text-center text-[17vw] leading-[0.8] font-bold tracking-tighter text-blue-light-active/60 select-none">
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
