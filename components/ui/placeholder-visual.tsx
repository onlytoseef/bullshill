import { cn } from "@/lib/utils";

type Props = {
  /** Shown centred — doubles as a note of what art belongs here. */
  label?: string;
  /** Gradient endpoints. */
  from: string;
  to: string;
  className?: string;
};

/**
 * Stand-in for artwork that hasn't landed yet.
 *
 * Replace with <Image> once files arrive in `public/assets/images/` — keep the
 * same wrapper classes and nothing around it needs to move.
 */
export function PlaceholderVisual({ label, from, to, className }: Props) {
  return (
    <div
      className={cn(
        "relative isolate overflow-hidden rounded-2xl ring-1 ring-white/10",
        className,
      )}
      style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      {/* Faint grid so flat gradients don't read as a loading state. */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"
      />
      {label ? (
        <span className="absolute inset-x-0 bottom-0 p-5 text-sm font-medium text-white/90">
          {label}
        </span>
      ) : null}
    </div>
  );
}
