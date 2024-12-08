import type { LuxeConfig } from "./config/index.js";

/**
 * Define a new Luxe configuration object.
 *
 * This function is used to define a new Luxe configuration object.
 * It adds additional features like type checking and validation.
 *
 * This is the recommended way to define a new Luxe configuration object
 * in your Luxe config file.
 *
 * @param config
 * @returns
 */
export const defineLuxeConfig = <T extends LuxeConfig = LuxeConfig>(
  config: T,
): T => {
  return config;
};
