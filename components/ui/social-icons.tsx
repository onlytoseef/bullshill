/**
 * Social glyphs, inline so there's no icon-library dependency.
 *
 * All drawn on a 24×24 grid. The Instagram mark is built from primitives rather
 * than a single path — easier to verify by eye than a long path string.
 */

const common = {
  viewBox: "0 0 24 24",
  "aria-hidden": true,
  className: "size-4",
} as const;

function X() {
  return (
    <svg {...common} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedIn() {
  return (
    <svg {...common} fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
  );
}

function Instagram() {
  return (
    <svg
      {...common}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
    >
      <rect x="2.75" y="2.75" width="18.5" height="18.5" rx="5.5" />
      <circle cx="12" cy="12" r="4.25" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function Telegram() {
  return (
    <svg {...common} fill="currentColor">
      <path d="M20.665 3.717 2.935 10.554c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 1.714 5.25c.21.63.107.879.766.879.508 0 .733-.235 1.017-.514l2.195-2.134 4.656 3.44c.863.477 1.48.23 1.69-.75l3.055-14.396c.303-1.2-.452-1.747-1.693-1.494z" />
    </svg>
  );
}

const icons = {
  X,
  LinkedIn,
  Instagram,
  Telegram,
} as const;

export type SocialName = keyof typeof icons;

export function SocialIcon({ name }: { name: string }) {
  const Icon = icons[name as SocialName];
  // Unknown label — render the initial so a content change can't crash the page.
  if (!Icon) {
    return <span className="text-xs font-semibold">{name.charAt(0)}</span>;
  }
  return <Icon />;
}
