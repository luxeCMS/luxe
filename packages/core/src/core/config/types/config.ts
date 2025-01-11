import type { z } from "zod";
import type { moduleSchema } from "../zod/config-schema.js";

export type Module = z.infer<typeof moduleSchema>;

/**
 * The Luxe configuration object.
 *
 * This object is used to define the modules and plugins that should be loaded by Luxe.
 */
export type LuxeUserConfig = {
  /**
   * The URL of the PostgreSQL database that Luxe should connect to.
   *
   * This URL should be in the format `postgres://<username>:<password>@<host>:<port>/<database>`.
   */
  postgresUrl: string;
  /**
   * The core modules that should be loaded by Luxe.
   *
   * Choose what modules to load by adding them to this array.
   */
  modules: Module;
};
