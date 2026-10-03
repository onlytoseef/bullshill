import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Props = {
  /** Small label above the heading, e.g. "Our services". */
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
};

/**
 * The eyebrow / title / subtitle stack that opens most sections.
 */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: Props) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        centered && "items-center text-center",
        className,
      )}
    >
      {eyebrow ? (
        <span
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-4 py-1.5",
            "border border-surface-border bg-surface-card/60",
            "text-xs font-medium tracking-wide text-blue-light-active uppercase",
          )}
        >
          <span
            aria-hidden
            className="size-1.5 rounded-full bg-orange"
          />
          {eyebrow}
        </span>
      ) : null}

      <h2 className="text-display-sm font-semibold text-white sm:text-display-md lg:text-display-lg">
        {title}
      </h2>

      {subtitle ? (
        <p
          className={cn(
            "max-w-2xl text-base text-blue-light-active",
            centered && "mx-auto",
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
