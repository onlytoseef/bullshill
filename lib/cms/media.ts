/**
 * One place where a Payload upload URL becomes a URL the site can hand to
 * `next/image`.
 *
 * Two jobs, both about the same string:
 *
 * 1. Strip the `serverURL` prefix. Payload returns covers as
 *    `https://host/api/media/file/x.png`, and `next/image` only optimises
 *    same-origin paths — an absolute URL pointing at this very server is
 *    rejected at render time. Returning a relative path sidesteps that and
 *    works whichever host `NEXT_PUBLIC_SERVER_URL` holds.
 *
 * 2. Append `?v=<updatedAt>`. Upload filenames are stable — editing an image
 *    (crop, focal point) rewrites the file under the same name — so without a
 *    version the optimiser would keep serving its year-long cached copy of the
 *    old artwork. Payload bumps `updatedAt` on every edit, which gives each
 *    revision of an image its own optimiser cache key.
 */
const UPLOAD_PATH = "/api/media/";

/** Epoch milliseconds: compact, URL-safe, and unique per edit. */
function mediaVersion(updatedAt?: string | null): string | null {
  if (!updatedAt) return null;
  const time = Date.parse(updatedAt);
  return Number.isNaN(time) ? null : String(time);
}

/** The same-origin path for an upload, or `null` when it is not one. */
export function uploadPath(url: string): string | null {
  if (url.startsWith(UPLOAD_PATH)) return url;

  try {
    const parsed = new URL(url);
    return parsed.pathname.startsWith(UPLOAD_PATH) ? parsed.pathname : null;
  } catch {
    return null;
  }
}

/**
 * Versioned, same-origin URL for a Payload upload.
 *
 * Anything that is not one of our uploads — a future external CDN, say — is
 * passed through untouched, because its URL is already content-addressed or
 * outside `next/image`'s remit.
 */
export function mediaUrl(url: string, updatedAt?: string | null): string {
  const path = uploadPath(url);
  if (!path) return url;

  const version = mediaVersion(updatedAt);
  if (!version) return path;

  return `${path}${path.includes("?") ? "&" : "?"}v=${version}`;
}
