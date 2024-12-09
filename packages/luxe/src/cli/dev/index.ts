import type { ArgumentsCamelCase } from "yargs";
import { loadLuxeConfigFile, validateConfig } from "../../core/config/index.js";
import { LuxeError } from "../../core/errors/index.js";
import { LuxeLog } from "../../core/logger/index.js";

export const dev = async (argv: ArgumentsCamelCase<object>) => {
  const logger = LuxeLog.instance({
    level: argv.verbose ? "debug" : "info",
  });
  try {
    const config = await loadLuxeConfigFile();
    // We don't validate inside the `defineLuxeConfig` function because
    // not all users will use the `defineLuxeConfig` function,
    // so we validate the config here.
    const validatedConfig = validateConfig(config);
    logger.debug("Config loaded successfully");

    // Load the core modules
    for (const module of validatedConfig.modules) {
      if (module.hooks?.["luxe:module:start"]) {
        await module.hooks["luxe:module:start"]({});
      }
    }
  } catch (error) {
    if (LuxeError.isError(error)) {
      logger.error(error);
    } else {
      logger.error(error as Error);
    }
  }
};
