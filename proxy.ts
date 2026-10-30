import { NextResponse, type NextRequest } from "next/server";

/**
 * Drops forged Server Action IDs before they reach the app.
 *
 * `"The Server Reference ID did not match the expected format. Received \"x\""`
 * is NOT this app misbehaving. Automated scanners (the React2Shell probe and
 * its many copies) fire POSTs at every path with `Next-Action: x`, `action`,
 * `0`, `1` — short, obviously fake IDs — and Next logs one warning per probe.
 * They repeat for a second or two at a time, in a loop, at any hour, on sites
 * that define no Server Actions at all. Nothing in the application can stop
 * them appearing; only refusing the request earlier can.
 *
 * Real action IDs are 42 characters of build-generated hash (see
 * `next/dist/shared/lib/server-reference-info.js`). Everything shorter cannot
 * be a legitimate call, so it gets a 400 here and never reaches the renderer.
 *
 * This is noise reduction, not a security control: Server Actions are public
 * POST endpoints and still need their own authorisation checks.
 */
const MIN_ACTION_ID_LENGTH = 16;

export function proxy(request: NextRequest) {
  if (request.method !== "POST") return;

  const actionId = request.headers.get("next-action");
  if (actionId !== null && actionId.length < MIN_ACTION_ID_LENGTH) {
    return new NextResponse("Invalid Server Action request.", { status: 400 });
  }
}

export const config = {
  // Everything except the immutable build assets, which never need this check.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
