import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Horizontal gutter and max width, shared by every section. */
export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-6", className)}>
      {children}
    </div>
  );
}

/** Section shell carrying the page's vertical rhythm. */
export function Section({
  id,
  children,
  className,
  style,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <section id={id} className={cn("py-20 sm:py-28", className)} style={style}>
      {children}
    </section>
  );
}
