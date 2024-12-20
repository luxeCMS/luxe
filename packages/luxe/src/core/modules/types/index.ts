import type { LuxeLifecycleHooks } from "../../lifecycle/types/index.js";

export type Module = {
  /**
   * The unique name of the module.
   */
  name: string;

  /**
   * Hook functions that should be executed during the lifecycle of the module.
   */
  hooks?: LuxeLifecycleHooks;
};
