import {
  LuxeError,
  LuxeLog,
  type LuxeConfig,
  resolveConfig,
  dev as luxeDev,
} from "@luxecms/core";
import { fileURLToPath } from "node:url";
import path from "node:path";

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

    devServer = await luxeDev(
      config,
      logger,
      path.join(fileURLToPath(new URL("../../src/astro", import.meta.url))),
    );
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
