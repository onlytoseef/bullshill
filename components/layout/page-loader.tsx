"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import logo from "../../app/assets/images/logo.png";

export function PageLoader() {
  const [exiting, setExiting] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const exitTimer = window.setTimeout(() => setExiting(true), 1500);
    const removeTimer = window.setTimeout(() => setVisible(false), 3100);

    return () => {
      window.clearTimeout(exitTimer);
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
          <Image src={logo} alt="" width={48} height={48} priority />
        </div>
      </div>
    </div>
  );
}
