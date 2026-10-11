"use client";

import dynamic from "next/dynamic";

export const ShareLinksLazy = dynamic(() =>
  import("./share-links").then((module) => module.ShareLinks),
);
