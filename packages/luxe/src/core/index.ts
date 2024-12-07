import { validateConfig } from "./config/index.js";
import type { LuxeConfig } from "./config/index.js";
import { LuxeError, LuxeErrors } from "./errors/index.js";

export const defineLuxeConfig = (
  config: LuxeConfig,
): LuxeConfig | undefined => {
  try {
    return validateConfig(config);
  } catch (error) {
    if (LuxeError.is(error)) {
      throw error;
    }
    throw LuxeErrors.Config.FailedToParse;
  }
};
