import type { Module } from "../../modules/types/index.js";
import type { Plugin } from "../../plugins/types/index.js";

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
  modules: Array<Module>;

  /**
   * The plugins that should be loaded by Luxe.
   *
   * Choose what plugins to load by adding them to this array.
   */
  plugins?: Array<Plugin>;
};
