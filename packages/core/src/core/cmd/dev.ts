import {
  establishLuxeDatabaseConnection,
  initializeLuxeDatabase,
  type LuxeLog,
  luxeQuery,
} from "../index.js";
import { astroDev } from "../../server/index.js";
import type { LuxeConfig } from "../../types/index.js";

export const dev = async (config: LuxeConfig, logger: LuxeLog) => {
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
      await module.hooks["luxe:server:before"]({ logger, query: luxeQuery });
    }
  }

  logger.debug("Initialized module `luxe:server:before` hooks successfully");

  const devServer = await astroDev(config.astro);

  for (const module of config.modules) {
    if (module.hooks?.["luxe:server:ready"]) {
      await module.hooks["luxe:server:ready"]({ logger, server: devServer });
    }
  }

  return {
    close: async () => {
      for (const module of config.modules) {
        if (module.hooks?.["luxe:server:close"]) {
          await module.hooks["luxe:server:close"]({ logger });
        }
      }
      await devServer.stop();
    },
  };
};
