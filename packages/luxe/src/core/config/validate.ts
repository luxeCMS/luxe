import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { LuxeError, LuxeErrors } from "../errors/index.js";

interface LuxeCoreModuleConfig {
  name: string;
}

interface LuxeCorePluginConfig {
  name: string;
}

/**
 * The Luxe configuration object
 *
 * This object is used to define the modules and plugins that should be loaded by Luxe
 */
export type LuxeConfig = {
  modules: LuxeCoreModuleConfig[];
  plugins: LuxeCorePluginConfig[];
};

/**
 * Find the root of the project by searching up for a package.json file
 * @param startPath the path to start searching from
 * @returns the path to the project root
 * @throws {LuxeError} if the project root could not be found
 */
export const findProjectRoot = async (startPath: string): Promise<string> => {
  try {
    const stats = await fs.stat(startPath);
    if (!stats.isDirectory()) {
      throw LuxeErrors.Config.NoRoot;
    }
  } catch {
    throw LuxeErrors.Config.NoRoot;
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

  throw LuxeErrors.Config.NoRoot;
};

/**
 * Compile the given TS configuration file using esbuild
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
    throw LuxeErrors.Config.FailedToBuildTs;
  }

  return result.outputFiles[0].text;
};

/**
 * Load the configuration file from the given path; supports .js, .mjs and .ts files
 *
 * When loading a TS file, it will be compiled using esbuild and then imported as an esm module
 * and the temporary compiled file will be deleted after the import
 *
 * @param configPath the path to the configuration file
 * @returns the configuration object
 * @throws {LuxeError} if the configuration file could not be loaded
 */
export const importConfigFile = async (
  configPath: string,
): Promise<LuxeConfig | undefined> => {
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
        throw LuxeErrors.Config.NoDefaultExport;
      }
      return mod.default;
    } catch (error) {
      await fs.unlink(tmpFile)?.catch(() => {});
      if (LuxeError.is(error)) {
        throw error;
      }
      throw LuxeErrors.Config.FailedToDynamicImport;
    }
  }

  const mod = (await import(fileUrl)) as { default?: LuxeConfig };
  if (!mod.default) {
    throw LuxeErrors.Config.NoDefaultExport;
  }
  return mod.default;
};

/**
 * Read the Luxe configuration file from the root of the project
 * @param cwd the current working directory (default: process.cwd())
 * @returns the LuxeCoreConfig object
 * @throws {LuxeConfigError} if the configuration file is not found or invalid
 */
export const loadLuxeConfigFile = async (
  cwd = process.cwd(),
): Promise<LuxeConfig> => {
  const projectRoot = await findProjectRoot(cwd).catch((error) => {
    if (LuxeError.is(error)) {
      throw error;
    }
    throw LuxeErrors.Config.NoRoot;
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
      throw LuxeErrors.Config.NoConfigFile;
    } catch (error) {
      if (LuxeError.is(error)) {
        throw error;
      }
    }
  }

  throw LuxeErrors.Config.NoConfigFile;
};

/**
 * Validate the given configuration object
 * @param config the configuration object to validate
 * @returns the validated configuration object
 * @throws {LuxeError} if the configuration object is invalid
 */
export const validateConfig = (config: LuxeConfig): LuxeConfig => {
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
