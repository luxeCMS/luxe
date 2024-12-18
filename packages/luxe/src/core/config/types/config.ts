import type { z } from "zod";
import type { lifecycleHooksSchema } from "../zod/config-schema.js";

export type LuxeLifecycleHooks = {
  /**
   * Called at the start of the system lifecycle
   * @returns Promise<void>
   */
  "luxe:init"?: z.infer<typeof lifecycleHooksSchema>["luxe:init"];

  /**
   * Called before each module is loaded
   * @returns Promise<void>
   */
  "luxe:module:start"?: z.infer<
    typeof lifecycleHooksSchema
  >["luxe:module:start"];

  /**
   * Called after each module is loaded
   * @returns Promise<void>
   */
  "luxe:module:ready"?: z.infer<
    typeof lifecycleHooksSchema
  >["luxe:module:ready"];

  /**
   * Called after all modules are loaded
   * @returns Promise<void>
   */
  "luxe:module:done"?: z.infer<typeof lifecycleHooksSchema>["luxe:module:done"];

  /**
   * Called before each plugin is loaded
   * @returns Promise<void>
   */
  "luxe:plugin:start"?: z.infer<
    typeof lifecycleHooksSchema
  >["luxe:plugin:start"];

  /**
   * Called after each plugin is loaded
   * @returns Promise<void>
   */
  "luxe:plugin:ready"?: z.infer<
    typeof lifecycleHooksSchema
  >["luxe:plugin:ready"];

  /**
   * Called after all plugins are loaded
   * @returns Promise<void>
   */
  "luxe:plugin:done"?: z.infer<typeof lifecycleHooksSchema>["luxe:plugin:done"];

  /**
   * Called when system is ready for operation
   * @returns Promise<void>
   */
  "luxe:ready"?: z.infer<typeof lifecycleHooksSchema>["luxe:ready"];

  /**
   * Called when system is shutting down
   * @returns Promise<void>
   */
  "luxe:cleanup"?: z.infer<typeof lifecycleHooksSchema>["luxe:cleanup"];
};

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
  modules: Array<{
    /**
     * The unique name of the module.
     */
    name: string;

    /**
     * The hooks that should be executed during the lifecycle of the module.
     */
    hooks?: LuxeLifecycleHooks;
  }>;

  /**
   * The plugins that should be loaded by Luxe.
   *
   * Choose what plugins to load by adding them to this array.
   */
  plugins?: Array<{
    /**
     * The name of the plugin.
     *
     * All plugins must have a unique name.
     */
    name: string;

    /**
     * The hooks that should be executed during the lifecycle of the plugin.
     */
    hooks?: LuxeLifecycleHooks;
  }>;
};
