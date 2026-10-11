import { cn } from "@/lib/utils";

type Props = {
  label?: string;
  from: string;
  to: string;
  className?: string;
};

export function PlaceholderVisual({ label, from, to, className }: Props) {
  return (
    <div
      className={cn(
        "relative isolate overflow-hidden rounded-2xl ring-1 ring-white/10",
        className,
      )}
      style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
    >
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
