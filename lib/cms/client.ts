import config from "@payload-config";
import { getPayload, type Payload } from "payload";

let client: Payload | null = null;
let pending: Promise<Payload | null> | null = null;

/**
 * The one Payload instance this process uses.
 *
 * Fail-soft by design: if the database is unreachable the caller gets `null`
 * and renders an empty blog rather than a 500 — the site must keep serving even
 * when the CMS is down. The instance is cached on success only, so a database
 * that comes back up is picked up without a restart.
 */
export async function getCms(): Promise<Payload | null> {
  if (client) return client;

  if (!pending) {
    pending = getPayload({ config })
      .then((payload) => {
        client = payload;
        return payload;
      })
      .catch((error: unknown) => {
        console.warn(
          "[cms] Payload is unavailable — the blog will render empty.",
          error instanceof Error ? error.message : error,
        );
        return null;
      })
      .finally(() => {
        pending = null;
      });
  }

  return pending;
}
