import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  /** Optional leading glyph or icon. */
  icon?: ReactNode;
  className?: string;
};

/** Small capability tag, as used under each service in "What We Do". */
export function TagPill({ children, icon, className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5",
        "border border-surface-border bg-surface-raised",
        "text-xs font-medium text-blue-light-active",
        className,
      )}
    >
      {icon ? (
        <span aria-hidden className="text-orange">
          {icon}
        </span>
      ) : null}
      {children}
    </span>
  );
}
