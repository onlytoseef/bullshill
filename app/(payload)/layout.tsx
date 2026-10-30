import config from "@payload-config";
import { RootLayout } from "@payloadcms/next/layouts";
import type { ReactNode } from "react";

import { importMap } from "./admin/importMap.js";
import { serverFunction } from "./server-function";

import "@payloadcms/next/css";
import "./custom.scss";

/**
 * The admin's own root layout.
 *
 * It deliberately does not inherit the site's layout — that one carries the
 * marketing chrome, Lenis smooth scrolling and the three.js backdrops, none of
 * which belong inside the CMS. The `(payload)` route group is what gives the
 * admin a clean `<html>`/`<body>` of its own.
 */
export { metadata } from "@payloadcms/next/layouts";

export default function PayloadAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <RootLayout
      config={config}
      importMap={importMap}
      serverFunction={serverFunction}
    >
      {children}
    </RootLayout>
  );
}
