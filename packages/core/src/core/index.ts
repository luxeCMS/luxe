import type { validateLuxeConfig } from "./config/validate.js";

/**
 * If you want to expose the core functionality of Luxe, you can do so here.
 * This file should only contain exports and no implementation details.
 */
export { LuxeLog } from "./logger/index.js";
export {
  initializeLuxeDatabase,
  establishLuxeDatabaseConnection,
  luxeQuery,
} from "./db/index.js";
export { LuxeError, LuxeErrors } from "./errors/index.js";
export { resolveConfig, defineConfig } from "./config/index.js";
export type LuxeConfig = ReturnType<typeof validateLuxeConfig>;
