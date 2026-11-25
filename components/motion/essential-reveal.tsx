"use client";

import { useRef, type ReactNode } from "react";
import { useEssentialReplay } from "./essential-replay";
import styles from "./essential-entrance.module.css";

export function EssentialReveal({ children, className = "", replayFirstEntry = false }: { children: ReactNode; className?: string; replayFirstEntry?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEssentialReplay(ref, replayFirstEntry);
  return <div ref={ref} className={`${className} ${styles.reveal}`}>{children}</div>;
}
