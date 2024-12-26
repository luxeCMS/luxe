import type { ParsedArgs } from "citty";
import {
  LuxeError,
  LuxeErrors,
  LuxeLog,
  type LuxeConfig,
  processLuxeConfigFile,
} from "luxecms";

const dev = async (argv: ParsedArgs) => {
  const logger = LuxeLog.instance({
    level: argv.verbose ? "debug" : "info",
  });
  let validatedConfig: LuxeConfig | null = null;

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

export default dev;
