import type { ArgumentsCamelCase } from "yargs";
import { readRootLuxeConfigFile } from "~/core/config";
import { LuxeError } from "~/core/errors";

export const dev = async (argv: ArgumentsCamelCase<object>) => {
  try {
    const config = await readRootLuxeConfigFile();
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
    if (error instanceof LuxeError) {
      console.error(error.toString());
    } else {
      console.error("An unknown error occurred");
    }
  }
};
