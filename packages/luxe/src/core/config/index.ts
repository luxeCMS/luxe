import { resolve } from "node:path";
import type { LuxeLog } from "../logger/index.js";
import * as dotenv from "dotenv";
import { loadLuxeConfigFile, validateConfig } from "./validate.js";
import type { LuxeUserConfig } from "./types/config.js";

export {
  validateConfig,
  buildTsConfig,
  findProjectRoot,
  importConfigFile,
  loadLuxeConfigFile,
} from "./validate.js";

export const processLuxeConfigFile = async (logger: LuxeLog) => {
  // Load the .env file so users don't have to do it themselves
  // We use the .env file to read the environment variables. (eg. the POSTGRES_URL, PORT, etc.)
  dotenv.config({ path: resolve(process.cwd(), ".env") });

  const config = await loadLuxeConfigFile();
  // We don't validate inside the `defineConfig` function because
  // not all users will use the `defineConfig` function,
  // so we validate the config here.
  const validatedConfig = validateConfig(config);
  logger.debug("LuxeConfig loaded successfully");
  return validatedConfig;
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
 *   plugins: [{
 *     id: 'my-plugin',
 *     version: '1.0.0'
 *   }]
 * });
 * ```
 */
export function defineConfig(config: LuxeUserConfig): LuxeUserConfig {
  return config;
}

export type { LuxeUserConfig };
