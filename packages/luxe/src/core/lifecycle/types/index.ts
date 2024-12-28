import type { z } from "zod";
import type { lifecycleHooksSchema } from "../../config/zod/config-schema.js";

/*
 * The reason we have a separate type for lifecycle hooks is so we can add comments to the types.
 * If we just used the zod schema directly, we would not be able to add comments. The comments
 * will help the user in understanding what each lifecycle hook does.
 */

/**
 * These lifecycle hooks are executed during the lifecycle of the Luxe application.
 *
 * - The migration hooks are executed during the migration process by the CLI `migrate` command.
 * - The server hooks are executed during the lifecycle of the core server by the CLI `dev` or `start` commands.
 */
export type LuxeLifecycleHooks = {
  /**
   * Called before the migration process starts.
   *
   * Here you can perform any setup that is required before the migration process starts,
   * such as creating tables or indexes.
   */
  "luxe:migrate:before"?: z.infer<
    typeof lifecycleHooksSchema
  >["luxe:migrate:before"];

  /**
   * Called when the migration process starts.
   *
   * Here you can perform any operations that require a connection to the database,
   * such as checking data integrity or performing manual migrations.
   */
  "luxe:migrate:start"?: z.infer<
    typeof lifecycleHooksSchema
  >["luxe:migrate:start"];

  /**
   * Called when the migration process is complete.
   *
   * Here you can perform any cleanup operations that are required after a successful migration.
   */
  "luxe:migrate:done"?: z.infer<
    typeof lifecycleHooksSchema
  >["luxe:migrate:done"];

  /**
   * Called when the migration process encounters an error.
   *
   * Here you can handle down migrations if an error occurs during the migration process.
   */
  "luxe:migrate:error"?: z.infer<
    typeof lifecycleHooksSchema
  >["luxe:migrate:error"];

  /**
   * Called before modules and plugins are loaded and before the server starts.
   *
   * Here you can handle any setup that is required before the server starts,
   * such as injecting routes, middleware, modifying the Luxe config, etc.
   */
  "luxe:server:init"?: z.infer<typeof lifecycleHooksSchema>["luxe:server:init"];

  /**
   * Called after all modules and plugins are loaded but before the server starts.
   *
   * Here you can handle any setup that is required before the server starts but
   * after all modules and plugins are loaded. This is useful if you need to access
   * the modules and plugins to perform setup operations that rely on other modules/plugins.
   */
  "luxe:server:before"?: z.infer<
    typeof lifecycleHooksSchema
  >["luxe:server:before"];

  /**
   * Called right after the server starts and runs all initial setup processes.
   *
   * Here you can perform any operations that require a running server,
   * such as setting up websockets, starting background tasks, etc.
   */
  "luxe:server:ready"?: z.infer<
    typeof lifecycleHooksSchema
  >["luxe:server:ready"];

  /**
   * Called when the server encounters an error.
   *
   * Here you can handle any errors that occur during the server's lifecycle.
   * This is useful for logging errors, sending alerts, etc.
   */
  "luxe:server:error": z.infer<
    typeof lifecycleHooksSchema
  >["luxe:server:error"];

  /**
   * Called when the server is shutting down.
   *
   * Here you can perform any cleanup operations that are required before the server shuts down,
   * such as closing connections, saving state, etc.
   */
  "luxe:server:close"?: z.infer<
    typeof lifecycleHooksSchema
  >["luxe:server:close"];
};
