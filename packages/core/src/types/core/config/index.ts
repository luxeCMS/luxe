import type { AstroUserConfig } from "astro";
import type { Module } from "../module/index.js";

export type LuxeConfig = {
  /**
   * The URL of the PostgreSQL database that Luxe should connect to.
   */
  postgresUrl: string;

  /**
   * The core modules that should be loaded by Luxe.
   */
  modules: Array<Module>;

  /**
   * The Astro configuration object. This object is used to configure the internal Astro server used by Luxe to serve the Admin UI and the API. This is not your frontend server.
   *
   * Astro User Config Docs: https://docs.astro.build/reference/configuration-reference/
   *
   * Generics do not follow semver and may change at any time.
   */
  astro: Omit<AstroUserConfig, "output" | "srcDir" | "root">;
};

export type LuxeUserConfig = Partial<LuxeConfig>;
