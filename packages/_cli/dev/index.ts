import type { ArgumentsCamelCase } from "yargs";
import type { validateConfig } from "../../core/config/index.js";
import { LuxeError, LuxeErrors } from "../../core/errors/index.js";
import { LuxeLog } from "../../core/logger/index.js";
import { processLuxeConfigFile } from "../utils/index.js";

export const dev = async (argv: ArgumentsCamelCase<object>) => {
  const logger = LuxeLog.instance({
    level: argv.verbose ? "debug" : "info",
  });
  let validatedConfig: ReturnType<typeof validateConfig> | null = null;

  try {
    validatedConfig = await processLuxeConfigFile(logger);

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
