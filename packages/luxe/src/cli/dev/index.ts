import type { ArgumentsCamelCase } from "yargs";
import * as dotenv from "dotenv";
import { resolve } from "node:path";
import { loadLuxeConfigFile, validateConfig } from "../../core/config/index.js";
import { LuxeError, LuxeErrors } from "../../core/errors/index.js";
import { LuxeLog } from "../../core/logger/index.js";

export const dev = async (argv: ArgumentsCamelCase<object>) => {
  const logger = LuxeLog.instance({
    level: argv.verbose ? "debug" : "info",
  });

  let validatedConfig: ReturnType<typeof validateConfig> | null = null;
  try {
    // Load the .env file so users don't have to do it themselves
    dotenv.config({ path: resolve(process.cwd(), ".env") });

    const config = await loadLuxeConfigFile();
    // We don't validate inside the `defineConfig` function because
    // not all users will use the `defineConfig` function,
    // so we validate the config here.
    validatedConfig = validateConfig(config);
    logger.debug("Config loaded successfully");

    // Load the core modules
    for (const module of validatedConfig.modules) {
      if (module.hooks?.["luxe:server:start"]) {
        await module.hooks["luxe:server:start"]({ logger });
      }
    }

    throw LuxeErrors.NotImplemented("dev")();
  } catch (error) {
    if (LuxeError.isError(error)) {
      logger.error(error);
    } else {
      logger.error(error as Error);
    }
  } finally {
    if (validatedConfig) {
      for (const module of validatedConfig.modules) {
        if (module.hooks?.["luxe:server:shutdown"]) {
          await module.hooks["luxe:server:shutdown"]({ logger });
        }
      }
    }
  }
};
