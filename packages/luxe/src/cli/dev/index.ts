import type { ArgumentsCamelCase } from "yargs";
import { loadLuxeConfigFile, validateConfig } from "~/core/config/index.js";
import { LuxeError } from "~/core/errors/index.js";
import { LuxeLog } from "~/core/logger/index.js";

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

    const modules = validatedConfig.modules;
    const plugins = validatedConfig.plugins;

    console.log("\nModules:");
    for (const module of modules) {
      console.log(`- ${module.name}`);
    }

    console.log("\nPlugins:");
    for (const plugin of plugins) {
      console.log(`- ${plugin.name}`);
    }
  } catch (error) {
    if (LuxeError.isError(error)) {
      logger.error(error);
    } else {
      logger.error(
        new LuxeError({
          message: (error as Error)?.message ?? "An unknown error occurred",
          code: "UNKNOWN_ERROR",
        }),
      );
    }
  }
};
