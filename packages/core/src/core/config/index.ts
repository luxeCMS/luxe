import { resolve } from "node:path";
import * as dotenv from "dotenv";
import type { LuxeUserConfig } from "./types/config.js";
import type { z } from "zod";
import type { configSchema } from "./zod/config-schema.js";

import { validateLuxeConfig, parseLuxeConfigFileInDir } from "./validate.js";

export const resolveConfig = async (cwd = process.cwd()) => {
  // Load the .env file first, as it may contain data
  // that is required for the configuration file
  dotenv.config({ path: resolve(cwd, ".env") });
  const config = await parseLuxeConfigFileInDir(cwd);
  // We validate here instead of the `defineConfig` function because
  // not all users will use the `defineConfig` function
  return validateLuxeConfig(config);
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
