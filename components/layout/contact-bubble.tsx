import Link from "next/link";

/**
 * Floating contact affordance, bottom-right on every page.
 *
 * A plain link for now. If a chat provider (Intercom, Crisp, …) gets added
 * later, this is the element to replace with their launcher.
 */
export function ContactBubble() {
  return (
    <Link
      href="/#contact"
      className="fixed right-5 bottom-5 z-40 flex items-center gap-2 rounded-full bg-blue-darker/90 py-2.5 pr-5 pl-2.5 text-sm font-medium text-white shadow-xl ring-1 ring-white/10 backdrop-blur-sm transition-colors hover:bg-blue-dark"
    >
      <span
        aria-hidden
        className="grid size-7 place-items-center rounded-full bg-orange"
      >
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-3.5"
        >
          <path d="M14 7.5c0 2.8-2.7 5-6 5-.7 0-1.4-.1-2-.3L3 13.5l.8-2.3A4.7 4.7 0 012 7.5c0-2.8 2.7-5 6-5s6 2.2 6 5z" />
        </svg>
      </span>
      Contact us
    </Link>
  );
}
