import type { LuxeUserConfig } from "./config/types/config.js";

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
