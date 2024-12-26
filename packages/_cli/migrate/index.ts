import type { ArgumentsCamelCase } from "yargs";
import { LuxeError, LuxeErrors } from "../../core/errors/index.js";
import { LuxeLog } from "../../core/logger/index.js";
import type { validateConfig } from "../../core/config/validate.js";
import { processLuxeConfigFile } from "../utils/index.js";

export const migrateCreate = async (argv: ArgumentsCamelCase) => {
  const logger = LuxeLog.instance({
    level: argv.verbose ? "debug" : "info",
  });
  let validatedConfig: ReturnType<typeof validateConfig> | null = null;

  try {
    validatedConfig = await processLuxeConfigFile(logger);

    for (const module of validatedConfig.modules) {
      if (module.hooks?.["luxe:migrate:before"]) {
        await module.hooks["luxe:migrate:before"]({ logger });
      }
    }

    throw LuxeErrors.NotImplemented("migrate create")();
  } catch (error) {
    if (LuxeError.isError(error)) {
      logger.error(error);
    } else {
      logger.error(error as Error);
    }
  } finally {
    if (validatedConfig) {
      for (const module of validatedConfig.modules) {
        if (module.hooks?.["luxe:migrate:done"]) {
          await module.hooks["luxe:migrate:done"]({ logger });
        }
      }
    }
  }
};

export const migrateUp = async (argv: ArgumentsCamelCase) => {
  throw LuxeErrors.NotImplemented("migrate up")();
};

export const migrateDown = async (argv: ArgumentsCamelCase) => {
  throw LuxeErrors.NotImplemented("migrate down")();
};
