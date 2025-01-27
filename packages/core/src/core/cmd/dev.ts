import { astroDev } from "../../server/index.js";
import type { LuxeConfig, LuxeRoute } from "../../types/index.js";
import {
  type LuxeLog,
  establishLuxeDatabaseConnection,
  initializeLuxeDatabase,
  luxeQuery,
} from "../index.js";

export const dev = async (config: LuxeConfig, logger: LuxeLog) => {
  const routes: Array<LuxeRoute> = [];

  const injectRoute = (route: LuxeRoute) => {
    routes.push(route);
  };

  // this doesn't establish a usable connection
  await initializeLuxeDatabase(config.postgresUrl);
  logger.debug("Database initialized successfully");

  for (const module of config.modules) {
    if (module.hooks?.["luxe:server:init"]) {
      await module.hooks["luxe:server:init"]({
        logger,
        injectRoute,
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

  const devServer = await astroDev(config.astro, {
    routes,
  });

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
