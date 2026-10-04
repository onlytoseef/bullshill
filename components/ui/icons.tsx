/** Small right arrow used on buttons and links. */
export function ArrowIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      fill="none"
      className={`shrink-0 ${className}`}
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

/** Rounded-square tick, used as the glyph on capability tags. */
export function TagGlyph() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 14 14"
      fill="none"
      className="size-3.5 shrink-0"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="1.5" y="1.5" width="11" height="11" rx="3" />
      <path d="M4.5 7.2l1.8 1.8 3.2-3.6" />
    </svg>
  );
}

/** Paper plane, used on the blog page's call-to-action buttons. */
export function SendIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      fill="none"
      className={`shrink-0 ${className}`}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 1.5 7 9" />
      <path d="M14.5 1.5 10 14.5 7 9l-5.5-3z" />
    </svg>
  );
}

/** Circular arrow, marking the "latest updates" badge on the blog index. */
export function UpdatesIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 14 14"
      fill="none"
      className="size-3.5 shrink-0"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.2 7a5.2 5.2 0 1 1-1.6-3.75" />
      <path d="M12.4 1.4v2.6H9.8" />
    </svg>
  );
}

