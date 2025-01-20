import {
  type LuxeConfig,
  LuxeError,
  LuxeLog,
  dev as luxeDev,
  resolveConfig,
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
  let devServer: Awaited<ReturnType<typeof luxeDev>> | null = null;

  try {
    config = await resolveConfig();
    logger.debug("Loaded configuration successfully");

    devServer = await luxeDev(config, logger);
  } catch (error) {
    if (devServer) {
      await devServer.close();
      devServer = null;
      config = null;
    }
    if (LuxeError.isError(error)) {
      logger.error(error);
    } else {
      logger.error(error as Error);
    }
  }
  // TODO: add a graceful shutdown
};

export default dev;
