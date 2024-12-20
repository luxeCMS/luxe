import type { LuxeLifecycleHooks } from "../../lifecycle/types/index.js";

export type Plugin = {
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
};
