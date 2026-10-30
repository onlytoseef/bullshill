"use server";

import config from "@payload-config";
import { handleServerFunctions } from "@payloadcms/next/layouts";
import type { ServerFunctionClient } from "payload";

import { importMap } from "./admin/importMap.js";

/**
 * The admin's server function, in a module of its own.
 *
 * Payload's template inlines this in the layout, but with Next 16 + Turbopack an
 * action defined in `app/(payload)/layout.tsx` compiles without ever being
 * registered in the route's action manifest — every admin POST then 404s with
 * "Failed to find Server Action". Defining it in a dedicated `'use server'`
 * module makes it discoverable, and is equivalent at runtime.
 */
export const serverFunction: ServerFunctionClient = async function (args) {
  return handleServerFunctions({ ...args, config, importMap });
};
