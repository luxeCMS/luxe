import type { LuxeLifecycleHooks } from "../lifecycle/index.js";

export interface LuxeCoreModule extends LuxeLifecycleHooks {
  /**
   * Name of the module
   */
  name: string;
}
