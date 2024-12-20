import { resolve } from "node:path";
import * as dotenv from "dotenv";
import {
  loadLuxeConfigFile,
  validateConfig,
} from "../../core/config/validate.js";
import type { LuxeLog } from "../../core/logger/index.js";

export const processLuxeConfigFile = async (logger: LuxeLog) => {
  // Load the .env file so users don't have to do it themselves
  dotenv.config({ path: resolve(process.cwd(), ".env") });

  const config = await loadLuxeConfigFile();
  // We don't validate inside the `defineConfig` function because
  // not all users will use the `defineConfig` function,
  // so we validate the config here.
  const validatedConfig = validateConfig(config);
  logger.debug("LuxeConfig loaded successfully");
  return validatedConfig;
};
