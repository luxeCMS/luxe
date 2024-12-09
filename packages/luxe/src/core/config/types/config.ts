export type LuxeLifecycleHooks = {
  /**
   * Called at the start of the system lifecycle
   * @returns Promise<void>
   */
  "luxe:init"?: (ctx: object) => void | Promise<void>;

  /**
   * Called before each module is loaded
   * @returns Promise<void>
   */
  "luxe:module:start"?: (ctx: object) => void | Promise<void>;

  /**
   * Called after each module is loaded
   * @returns Promise<void>
   */
  "luxe:module:ready"?: (ctx: object) => void | Promise<void>;

  /**
   * Called after all modules are loaded
   * @returns Promise<void>
   */
  "luxe:module:done"?: (ctx: object) => void | Promise<void>;

  /**
   * Called before each plugin is loaded
   * @returns Promise<void>
   */
  "luxe:plugin:start"?: (ctx: object) => void | Promise<void>;

  /**
   * Called after each plugin is loaded
   * @returns Promise<void>
   */
  "luxe:plugin:ready"?: (ctx: object) => void | Promise<void>;

  /**
   * Called after all plugins are loaded
   * @returns Promise<void>
   */
  "luxe:plugin:done"?: (ctx: object) => void | Promise<void>;

  /**
   * Called when system is ready for operation
   * @returns Promise<void>
   */
  "luxe:ready"?: (ctx: object) => void | Promise<void>;

  /**
   * Called when system is shutting down
   * @returns Promise<void>
   */
  "luxe:cleanup"?: (ctx: object) => void | Promise<void>;
};

/**
 * The Luxe configuration object.
 *
 * This object is used to define the modules and plugins that should be loaded by Luxe.
 */
export type LuxeUserConfig = {
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
