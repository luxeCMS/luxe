import { validateConfig } from "./config/index.js";
import type { LuxeConfig } from "./config/index.js";
import { LuxeError, LuxeErrors } from "./errors/index.js";

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
export const defineLuxeConfig = (
  config: LuxeConfig,
): LuxeConfig | undefined => {
  return config;
};
