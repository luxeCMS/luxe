import type { LuxeLifecycleHooks } from "../lifecycle/index.js";

export interface LuxeCorePlugin extends LuxeLifecycleHooks {
  /**
   * Name of the module
   */
  name: string;

  /**
   * Description of the module
   */
  description?: string;

  /**
   * Version of the module
   */
  version?: string;

  /**
   * Author of the module
   */
  author?: string;
}
