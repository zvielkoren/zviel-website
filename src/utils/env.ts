import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Safely retrieves an environment variable from the Cloudflare context or process.env.
 * Must be called inside a request handler to ensure Cloudflare Context is initialized.
 */
export function getEnvVar(name: string): string | undefined {
  try {
    const { env } = getCloudflareContext();
    if (env && typeof env === "object" && name in env) {
      const val = (env as Record<string, any>)[name];
      if (val) return String(val);
    }
  } catch (e) {
    // Ignore error when running in standard Node/Next dev/build env
  }
  return process.env[name];
}
