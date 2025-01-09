import {
  LuxeError,
  LuxeLog,
  type LuxeConfig,
  loadEnvFile,
  parseLuxeConfigFileInDir,
  validateLuxeConfig,
  initializeLuxeDatabase,
  establishLuxeDatabaseConnection,
  luxeQuery,
} from "@luxecms/core";
import path from "node:path";
import { fileURLToPath } from "node:url";

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

    // Initialize the database (but doesn't establish a connection)
    await initializeLuxeDatabase(validatedConfig.postgresUrl);

    logger.debug("Database initialized successfully");

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

    logger.debug("Initialized module `luxe:server:init` hooks successfully");

    establishLuxeDatabaseConnection(validatedConfig.postgresUrl);

    // Load the core modules
    for (const module of validatedConfig.modules) {
      if (module.hooks?.["luxe:server:before"]) {
        await module.hooks["luxe:server:before"]({ logger, luxeQuery });
      }
    }

    logger.debug("Initialized module `luxe:server:before` hooks successfully");

    const { dev } = await import("astro");
    try {
      await dev({
        srcDir: path.join(
          fileURLToPath(new URL("../../src/astro", import.meta.url)),
        ),
        root: path.join(
          fileURLToPath(new URL("../../src/astro", import.meta.url)),
        ),
        output: "server",
        server: {
          port: 5893,
        },
      });
    } catch (error) {
      logger.error(error as Error);
      throw new Error("Failed to start Astro dev server");
    }
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
