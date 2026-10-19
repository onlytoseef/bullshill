"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { releaseIntro } from "@/lib/intro-gate";
import logo from "../../app/assets/images/logo.webp";

export function PageLoader() {
  const [exiting, setExiting] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const exitTimer = window.setTimeout(() => setExiting(true), 1500);

    /**
     * The panels only start moving at 1720ms — `is-exiting` lands at 1500ms and
     * the clip-path transition carries a 220ms delay. Releasing just after that
     * lets the hero animate *into* the wipe rather than after it, and keeps the
     * whole entrance from playing behind opaque black.
     */
    const introTimer = window.setTimeout(releaseIntro, 1900);
    const removeTimer = window.setTimeout(() => setVisible(false), 3100);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(introTimer);
      window.clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className={`page-loader${exiting ? " is-exiting" : ""}`} aria-hidden>
      <div className="page-loader__panel page-loader__panel--left" />
      <div className="page-loader__panel page-loader__panel--right" />
      <div className="page-loader__content">
        <div className="page-loader__ring">
          <Image src={logo} alt="" width={48} height={48} preload />
        </div>
      </div>
    </div>
  );
}
