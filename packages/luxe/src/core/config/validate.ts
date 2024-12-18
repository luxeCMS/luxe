import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { LuxeError, LuxeErrors } from "../errors/index.js";
import type { LuxeUserConfig } from "./types/config.js";
import { configSchema } from "./zod/config-schema.js";

/**
 * Find the root of the project by searching up for a package.json file.
 * @param startPath the path to start searching from
 * @returns the path to the project root
 * @throws {LuxeError} if the project root could not be found
 */
export const findProjectRoot = async (startPath: string): Promise<string> => {
  try {
    const stats = await fs.stat(startPath);
    if (!stats.isDirectory()) {
      throw LuxeErrors.Config.NoRoot();
    }
  } catch {
    throw LuxeErrors.Config.NoRoot();
  }

  let currentPath = path.resolve(startPath);
  let maxDepth = 2;

  while (currentPath !== path.parse(currentPath).root && maxDepth > 0) {
    try {
      maxDepth--;
      const packagePath = path.join(currentPath, "package.json");
      const stats = await fs.stat(packagePath);

      if (stats.isFile()) {
        return currentPath;
      }
    } catch {
      currentPath = path.dirname(currentPath);
    }
  }

  throw LuxeErrors.Config.NoRoot();
};

/**
 * Compile the given TS configuration file using esbuild.
 * @param configPath the path to the configuration file
 * @returns the compiled configuration file as a string
 * @throws {LuxeError} if the configuration file could not be compiled
 */
export const buildTsConfig = async (configPath: string) => {
  const { build } = await import("esbuild");
  const result = await build({
    entryPoints: [configPath],
    bundle: true,
    write: false,
    format: "esm",
    target: "node18",
    platform: "node",
    packages: "external",
    mainFields: ["module", "main"],
    conditions: ["import", "default"],
  });

  if (!result.outputFiles?.[0]) {
    throw LuxeErrors.Config.FailedToBuildTs();
  }

  return result.outputFiles[0].text;
};

/**
 * Load the configuration file from the given path; supports .js, .mjs and .ts files.
 *
 * When loading a TS file, it will be compiled using esbuild and then imported as an esm module
 * and the temporary compiled file will be deleted after the import.
 *
 * @param configPath the path to the configuration file
 * @returns the configuration object
 * @throws {LuxeError} if the configuration file could not be loaded
 */
export const importConfigFile = async (
  configPath: string,
): Promise<LuxeUserConfig | undefined> => {
  const fileUrl = pathToFileURL(configPath).href;
  const ext = path.extname(configPath);

  if (ext === ".ts") {
    const tmpFile = configPath.replace(/\.ts$/, ".js");
    try {
      const tsOutput = await buildTsConfig(configPath);
      await fs.writeFile(tmpFile, tsOutput);
      const mod = await import(pathToFileURL(tmpFile).href);
      await fs.unlink(tmpFile);
      if (!mod.default) {
        throw LuxeErrors.Config.NoDefaultExport();
      }
      return mod.default;
    } catch (error) {
      await fs.unlink(tmpFile)?.catch(() => {});
      if (LuxeError.isError(error)) {
        throw error;
      }
      throw LuxeErrors.Config.FailedToDynamicImport();
    }
  }

  const mod = (await import(fileUrl)) as { default?: LuxeUserConfig };
  if (!mod.default) {
    throw LuxeErrors.Config.NoDefaultExport();
  }
  return mod.default;
};

/**
 * Read the Luxe configuration file from the root of the project.
 * @param cwd the current working directory (default: process.cwd())
 * @returns the LuxeCoreConfig object
 * @throws {LuxeConfigError} if the configuration file is not found or invalid
 */
export const loadLuxeConfigFile = async (
  cwd = process.cwd(),
): Promise<LuxeUserConfig> => {
  const projectRoot = await findProjectRoot(cwd).catch((error) => {
    if (LuxeError.isError(error)) {
      throw error;
    }
    throw LuxeErrors.Config.NoRoot();
  });

  const configFiles = ["luxe.config.ts", "luxe.config.js", "luxe.config.mjs"];

  for (const file of configFiles) {
    const filePath = path.join(projectRoot, file);
    try {
      await fs.access(filePath);
      const config = await importConfigFile(filePath);
      if (config) {
        return config;
      }
      throw LuxeErrors.Config.NoConfigFile();
    } catch (error) {
      if (LuxeError.isError(error)) {
        throw error;
      }
    }
  }

  throw LuxeErrors.Config.NoConfigFile();
};

/**
 * Validate the given configuration object.
 *
 * This function checks all properties of the configuration object and throws an error if any are invalid
 * or missing. It also validates each module and plugin.
 *
 * @param config the configuration object to validate
 * @returns the validated configuration object
 * @throws {LuxeError} if the configuration object is invalid
 */
export const validateConfig = <T extends LuxeUserConfig>(config: T) => {
  const validatedConfig = configSchema.parse(config);

  if (!validatedConfig) {
    // TODO: Use a different error here
    throw LuxeErrors.Config.Empty();
  }

  const moduleNames = new Set<string>();
  for (const module of validatedConfig?.modules ?? []) {
    if (moduleNames.has(module.name)) {
      throw LuxeErrors.Config.DuplicateTypeName("module", module.name)();
    }
    moduleNames.add(module.name);
  }

  const pluginNames = new Set<string>();
  for (const plugin of validatedConfig?.plugins ?? []) {
    if (pluginNames.has(plugin.name)) {
      throw LuxeErrors.Config.DuplicateTypeName("plugin", plugin.name)();
    }
    pluginNames.add(plugin.name);
  }

  return validatedConfig;
};
