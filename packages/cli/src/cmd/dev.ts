import {
  LuxeError,
  LuxeErrors,
  LuxeLog,
  type LuxeConfig,
  loadEnvFile,
  parseLuxeConfigFileInDir,
  validateLuxeConfig,
} from "luxecms";

export type DevCmdOptions = {
  port: number;
  verbose: boolean;
};

const dev = async (options: DevCmdOptions) => {
  const logger = LuxeLog.instance({
    level: options.verbose ? "debug" : "info",
  });
  let validatedConfig: LuxeConfig | null = null;

  try {
    // Load the .env file first, as it may contain data
    // that is required for the configuration file
    loadEnvFile();

    const parsedConfig = await parseLuxeConfigFileInDir();

    // We validate here instead of the `defineConfig` function because
    // not all users will use the `defineConfig` function
    validatedConfig = validateLuxeConfig(parsedConfig);

    logger.debug("Loaded configuration successfully");

    for (const module of validatedConfig.modules) {
      if (module.hooks?.["luxe:server:init"]) {
        await module.hooks["luxe:server:init"]({
          logger,
          // Pass in the config without the module/plugin hooks
          config: {
            ...validatedConfig,
            modules: validatedConfig.modules.map((m) => ({
              ...m,
              hooks: undefined,
            })),
            plugins: validatedConfig.plugins?.map((p) => ({
              ...p,
              hooks: undefined,
            })),
          },
        });
      }
    }

    // Load the core modules
    for (const module of validatedConfig.modules) {
      if (module.hooks?.["luxe:server:before"]) {
        await module.hooks["luxe:server:before"]({ logger });
      }
    }

    // TODO: loop through the plugins and run their `luxe:server:before` hooks

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
        if (module.hooks?.["luxe:server:close"]) {
          await module.hooks["luxe:server:close"]({ logger });
        }
      }
    }
  }
};

export default dev;
