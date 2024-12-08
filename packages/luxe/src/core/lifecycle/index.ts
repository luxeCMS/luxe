export type LuxeLifeCycleContextTypes =
  | "init"
  | "module:start"
  | "module:ready"
  | "module:done"
  | "plugin:start"
  | "plugin:ready"
  | "plugin:done"
  | "ready"
  | "cleanup";

export type LuxeLifecycleContext<T extends LuxeLifeCycleContextTypes> = {
  /**
   * Type of the lifecycle context
   */
  type: T;
};

export type LuxeLifecycleHooks = {
  /**
   * Called at the start of the system lifecycle
   * @returns Promise<void>
   */
  "luxe:init"?: (ctx: LuxeLifecycleContext<"init">) => Promise<void>;

  /**
   * Called before each module is loaded
   * @returns Promise<void>
   */
  "luxe:module:start"?: (
    ctx: LuxeLifecycleContext<"module:start">,
  ) => Promise<void>;

  /**
   * Called after each module is registered
   * @returns Promise<void>
   */
  "luxe:module:ready"?: (
    ctx: LuxeLifecycleContext<"module:ready">,
  ) => Promise<void>;

  /**
   * Called after all modules are loaded
   * @returns Promise<void>
   */
  "luxe:module:done"?: (
    ctx: LuxeLifecycleContext<"module:done">,
  ) => Promise<void>;

  /**
   * Called before each plugin is loaded
   * @returns Promise<void>
   */
  "luxe:plugin:start"?: (
    ctx: LuxeLifecycleContext<"plugin:start">,
  ) => Promise<void>;

  /**
   * Called after each plugin is loaded
   * @returns Promise<void>
   */
  "luxe:plugin:ready"?: (
    ctx: LuxeLifecycleContext<"plugin:ready">,
  ) => Promise<void>;

  /**
   * Called after all plugins are loaded
   * @returns Promise<void>
   */
  "luxe:plugin:done"?: (
    ctx: LuxeLifecycleContext<"plugin:done">,
  ) => Promise<void>;

  /**
   * Called when system is ready for operation
   * @returns Promise<void>
   */
  "luxe:ready"?: (ctx: LuxeLifecycleContext<"ready">) => Promise<void>;

  /**
   * Called when system is shutting down
   * @returns Promise<void>
   */
  "luxe:cleanup"?: (ctx: LuxeLifecycleContext<"cleanup">) => Promise<void>;
};
