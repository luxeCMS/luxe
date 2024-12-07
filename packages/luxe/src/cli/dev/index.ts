import type { ArgumentsCamelCase } from "yargs";
import { loadLuxeConfigFile } from "~/core/config/index.js";
import { LuxeError } from "~/core/errors/index.js";

export const dev = async (argv: ArgumentsCamelCase<object>) => {
  try {
    const config = await loadLuxeConfigFile();

    const modules = config.modules;
    const plugins = config.plugins;

    console.log("\nModules:");
    for (const module of modules) {
      console.log(`- ${module.name}`);
    }

    console.log("\nPlugins:");
    for (const plugin of plugins) {
      console.log(`- ${plugin.name}`);
    }
  } catch (error) {
    if (LuxeError.is(error)) {
      console.error(error.toString());
    } else {
      console.error("An unknown error occurred");
    }
  }
};
