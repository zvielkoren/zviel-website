import { D1Database } from "@cloudflare/workers-types";

declare global {
  var D1: D1Database | undefined;
}

export function getD1Client(): D1Database {
  if (!globalThis.D1) {
    throw new Error("D1 database not available");
  }
  return globalThis.D1;
}
