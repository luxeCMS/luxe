import { resolve } from "node:path";
import * as dotenv from "dotenv";
import type { LuxeUserConfig } from "./types/config.js";
import type { z } from "zod";
import type { configSchema } from "./zod/config-schema.js";

export { validateLuxeConfig, parseLuxeConfigFileInDir } from "./validate.js";

export const loadEnvFile = (cwd = process.cwd()) => {
  // Load the .env file so users don't have to do it themselves
  // We use the .env file to read the environment variables. (eg. the POSTGRES_URL, PORT, etc.)
  dotenv.config({ path: resolve(cwd, ".env") });
};

/**
 * Defines a type-safe configuration for Luxe
 * @param config - The Luxe configuration object
 * @returns A type-safe, readonly configuration object
 * @public
 *
 * @example
 * ```typescript
 * const config = defineConfig({
 *   modules: [{
 *     name: 'core',
 *     hooks: {
 *       onInit: async () => {
 *         console.log('Initializing core module');
 *       }
 *     }
 *   }],
 * });
 * ```
 */
export function defineConfig(config: z.infer<typeof configSchema>) {
  return config;
}

export type { LuxeUserConfig };
