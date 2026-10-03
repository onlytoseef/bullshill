import { site } from "@/lib/content";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

/**
 * The BullShill wordmark. Swap for an SVG once brand assets land.
 *
 * Inherits its colour from the parent rather than hardcoding one, so it works
 * on both the dark page and the light footer. Callers set the text colour.
 */
export function Wordmark({ className }: Props) {
  return (
    <span
      className={cn("text-lg font-semibold tracking-tight select-none", className)}
    >
      {site.name}
      <span className="text-orange">.</span>
    </span>
  );
}
