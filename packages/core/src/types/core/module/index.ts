import type { IncomingMessage, ServerResponse } from "node:http";
import type { AddressInfo } from "node:net";
import type { PgColumn, PgTableWithColumns } from "drizzle-orm/pg-core";
import type { FSWatcher } from "vite";
import type { LuxeError, LuxeLog, luxeQuery } from "../../../core/index.js";
import type { LuxeConfig, LuxeRoute } from "../config/index.js";
import type { Model } from "../models/index.js";

/*
 * The reason we have a type for Module and a Zod type is so we can add comments to the types.
 * If we just used the zod schema directly, we would not be able to add comments.
 */

export type Module = {
  /**
   * The unique name of the module.
   */
  name: string;

  /**
   * The models that should be constructed for the module.
   *
   * Models represent the database tables and the
   * fields represent the columns in the tables.
   */
  models?: PgTableWithColumns<{
    name: string;
    schema: string | undefined;
    dialect: "pg";
    columns: {
      [x: string]: PgColumn<
        {
          name: string;
          tableName: string;
          dataType: "string" | "number" | "boolean" | "json" | "date";
          generated: undefined;
          notNull: boolean;
          isPrimaryKey: boolean;
          isAutoincrement: boolean;
          hasDefault: boolean;
          hasRuntimeDefault: boolean;
          columnType: string;
          data: unknown;
          driverParam: unknown;
          enumValues: string[] | undefined;
        },
        object,
        object
      >;
    };
  }>[];

  /**
   * These lifecycle hooks are executed during the lifecycle of the Luxe application.
   *
   * - The migration hooks are executed during the migration process by the CLI `migrate` command.
   * - The server hooks are executed during the lifecycle of the core server by the CLI `dev` or `start` commands.
   */
  hooks?: {
    /**
     * Called before the migration process starts.
     *
     * Here you can perform any setup that is required before the migration process starts,
     * such as creating tables or indexes.
     */
    "luxe:migrate:before"?: ({
      logger,
    }: {
      logger: LuxeLog;
    }) => void | Promise<void>;

    /**
     * Called when the migration process starts.
     *
     * Here you can perform any operations that require a connection to the database,
     * such as checking data integrity or performing manual migrations.
     */
    "luxe:migrate:start"?: ({
      logger,
    }: {
      logger: LuxeLog;
    }) => void | Promise<void>;

    /**
     * Called when the migration process is complete.
     *
     * Here you can perform any cleanup operations that are required after a successful migration.
     */
    "luxe:migrate:done"?: ({
      logger,
    }: {
      logger: LuxeLog;
    }) => void | Promise<void>;

    /**
     * Called when the migration process encounters an error.
     *
     * Here you can handle down migrations if an error occurs during the migration process.
     */
    "luxe:migrate:error"?: ({
      logger,
    }: {
      logger: LuxeLog;
    }) => void | Promise<void>;

    /**
     * Called before modules and plugins are loaded and before the server starts.
     *
     * Here you can handle any setup that is required before the server starts,
     * such as injecting routes, middleware, modifying the Luxe config, etc.
     */
    "luxe:server:init"?: ({
      logger,
      injectRoute,
    }: {
      logger: LuxeLog;
      injectRoute: (route: LuxeRoute) => void;
    }) => void | Promise<void>;

    /**
     * Called after all modules and plugins are loaded but before the server starts.
     *
     * Here you can handle any setup that is required before the server starts but
     * after all modules and plugins are loaded. This is useful if you need to access
     * the modules and plugins to perform setup operations that rely on other modules/plugins.
     */
    "luxe:server:before"?: ({
      logger,
      query,
    }: {
      logger: LuxeLog;
      query: typeof luxeQuery;
    }) => void | Promise<void>;

    /**
     * Called right after the server starts and after all initial setup processes run.
     *
     * Here you can perform any operations that require a running server,
     * such as setting up websockets, starting background tasks, etc.
     */
    "luxe:server:ready"?: ({
      logger,
      server,
    }: {
      logger: LuxeLog;
      // This is the dev server returned by the `dev` command, copied from the `astro` package
      server: {
        address: AddressInfo;
        handle: (
          message: IncomingMessage,
          response: ServerResponse<IncomingMessage>,
        ) => void;
        watcher: FSWatcher;
        stop: () => Promise<void>;
      };
    }) => void | Promise<void>;

    /**
     * Called when the server encounters an error.
     *
     * Here you can handle any errors that occur during the server's lifecycle.
     * This is useful for logging errors, sending alerts, etc.
     */
    "luxe:server:error"?: ({
      logger,
      error,
    }: {
      logger: LuxeLog;
      error: LuxeError;
    }) => void | Promise<void>;

    /**
     * Called when the server is shutting down.
     *
     * Here you can perform any cleanup operations that are required before the server shuts down,
     * such as closing connections, saving state, etc.
     */
    "luxe:server:close"?: ({
      logger,
    }: {
      logger: LuxeLog;
    }) => void | Promise<void>;
  };
};
