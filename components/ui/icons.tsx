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
