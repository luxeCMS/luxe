import { LuxeError, LuxeErrors } from "./errors/index.js";

interface LuxeCoreModuleConfig {
  name: string;
}

interface LuxeCorePluginConfig {
  name: string;
}

export type LuxeConfig = {
  modules: LuxeCoreModuleConfig[];
  plugins: LuxeCorePluginConfig[];
};

export const defineLuxeConfig = (
  config: LuxeConfig,
): LuxeConfig | undefined => {
  try {
    return validateConfig(config);
  } catch (error) {
    if (error instanceof LuxeError) {
      throw error;
    }
    throw LuxeErrors.Config.FailedToParse;
  }
};

const validateConfig = (config: LuxeConfig): LuxeConfig => {
  if (!config) {
    throw LuxeErrors.Config.Empty;
  }
  if (!Array.isArray(config.modules)) {
    throw LuxeErrors.Config.PropertyNotArray("modules");
  }
  if (!Array.isArray(config.plugins)) {
    throw LuxeErrors.Config.PropertyNotArray("plugins");
  }

  let names = new Set<string>();
  for (const module of config.modules) {
    if (!module.name) {
      throw LuxeErrors.Config.MissingRequiredProperty("module", "name");
    }
    if (names.has(module.name)) {
      throw LuxeErrors.Config.DuplicateTypeName("module", module.name);
    }
    names.add(module.name);
  }

  names = new Set<string>();
  for (const plugin of config.plugins) {
    if (!plugin.name) {
      throw LuxeErrors.Config.MissingRequiredProperty("plugin", "name");
    }
    if (names.has(plugin.name)) {
      throw LuxeErrors.Config.DuplicateTypeName("plugin", plugin.name);
    }
    names.add(plugin.name);
  }

  return config;
};
