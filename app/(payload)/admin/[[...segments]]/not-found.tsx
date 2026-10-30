import config from "@payload-config";
import { NotFoundPage } from "@payloadcms/next/views";

import { importMap } from "../importMap.js";

/**
 * Next does not hand props to a `not-found` boundary, but Payload's view expects
 * both promises. Resolving empty ones satisfies the type and, more importantly,
 * means the view never touches an `undefined` promise at runtime.
 */
export default function AdminNotFound() {
  return NotFoundPage({
    config,
    importMap,
    params: Promise.resolve({ segments: [] }),
    searchParams: Promise.resolve({}),
  });
}
