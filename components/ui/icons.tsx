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

export function SendBadge() {
  return (
    <span
      aria-hidden
      className="grid size-5 place-items-center rounded-full bg-blue-darker text-white"
    >
      <SendIcon className="size-3" />
    </span>
  );
}

export function CoinCycleIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      className="size-6 shrink-0"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3.5 12a8.5 8.5 0 0 1 14.6-5.9" />
      <path d="M18.4 2.6v3.6h-3.6" />
      <path d="M20.5 12a8.5 8.5 0 0 1-14.6 5.9" />
      <path d="M5.6 21.4v-3.6h3.6" />
      <path d="M14.3 9.6c-.5-.6-1.3-.9-2.2-.9-1.3 0-2.2.6-2.2 1.6 0 2.2 4.5 1 4.5 3.2 0 1-.9 1.6-2.2 1.6-1 0-1.8-.3-2.4-.9M12 7.2v9.6" />
    </svg>
  );
}

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
