/**
 * Shared by server markup and its parser bootstrap. Keep this constant outside
 * the client-only decorative animation gate.
 *
 * `sessionStorage` is per tab and survives reloads, which is the lifetime we
 * want: the intro plays once, then neither a client navigation nor a refresh
 * replays it. A new tab is a new session.
 */
export const INTRO_SESSION_KEY = "bullshill:intro-seen";
