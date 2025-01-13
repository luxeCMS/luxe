import {
  LuxeError,
  LuxeLog,
  type LuxeConfig,
  resolveConfig,
  initializeLuxeDatabase,
  establishLuxeDatabaseConnection,
  luxeQuery,
  dev as luxeDev,
} from "@luxecms/core";

export type DevCmdOptions = {
  port: number;
  verbose: boolean;
};

const dev = async (options: DevCmdOptions) => {
  const logger = LuxeLog.instance({
    level: options.verbose ? "debug" : "info",
  });
  let config: LuxeConfig | null = null;

  try {
    config = await resolveConfig();
    logger.debug("Loaded configuration successfully");

    // this doesn't establish a usable connection
    await initializeLuxeDatabase(config.postgresUrl);
    logger.debug("Database initialized successfully");

    for (const module of config.modules) {
      if (module.hooks?.["luxe:server:init"]) {
        await module.hooks["luxe:server:init"]({
          logger,
          // Don't want users to alter the module hooks, so we exclude them
          config: {
            ...config,
            modules: config.modules.map((m) => ({
              ...m,
              hooks: undefined,
            })),
          },
        });
      }
    }
    logger.debug("Initialized module `luxe:server:init` hooks successfully");

    establishLuxeDatabaseConnection(config.postgresUrl);

    // Load the core modules
    for (const module of config.modules) {
      if (module.hooks?.["luxe:server:before"]) {
        await module.hooks["luxe:server:before"]({ logger, luxeQuery });
      }
    }

    logger.debug("Initialized module `luxe:server:before` hooks successfully");

    await luxeDev(config);
  } catch (error) {
    if (LuxeError.isError(error)) {
      logger.error(error);
    } else {
      logger.error(error as Error);
    }
  } finally {
    if (config) {
      for (const module of config.modules) {
        if (module.hooks?.["luxe:server:close"]) {
          await module.hooks["luxe:server:close"]({ logger });
        }
      }
    }
  }
};

export default dev;
