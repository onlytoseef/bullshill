/**
 * Shared between the loader (client) and the frontend layout's inline script
 * (server). It lives in its own module because `lib/intro-gate.ts` is
 * `"use client"`, and a constant imported from there resolves to `undefined`
 * when the server component renders.
 *
 * `sessionStorage` is per tab and survives reloads, which is the lifetime we
 * want: the intro plays once, then neither a client navigation nor a refresh
 * replays it. A new tab is a new session.
 */
export const INTRO_SESSION_KEY = "bullshill:intro-seen";
