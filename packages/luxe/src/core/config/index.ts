import type { LuxeConfig } from "..";
import path from "node:path";
import fs from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { LuxeError, LuxeErrors } from "../errors";

/**
 * Find the root of the project by searching up for a package.json file
 * @param startPath the path to start searching from
 * @returns the path to the project root
 * @throws {LuxeError} if the project root could not be found
 */
const findProjectRoot = async (startPath: string): Promise<string> => {
  let currentPath = startPath;
  let maxDepth = 5;
  while (currentPath !== path.parse(currentPath).root && maxDepth > 0) {
    try {
      maxDepth--;
      await fs.access(path.join(currentPath, "package.json"));
      return currentPath;
    } catch {
      currentPath = path.dirname(currentPath);
    }
  }
  throw LuxeErrors.Config.NoRoot;
};

/**
 * Load the configuration file from the given path; supports both JS and TS files
 *
 * When loading a TS file, it will be compiled using esbuild and then imported as an esm module
 *
 * @param configPath the path to the configuration file
 * @returns the configuration object
 */
const importConfigFile = async (configPath: string) => {
  const fileUrl = pathToFileURL(configPath).href;
  const ext = path.extname(configPath);

  if (ext === ".ts") {
    try {
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
      const { outputFiles } = result;
      if (!outputFiles?.[0]) {
        throw LuxeErrors.Config.FailedToBuildTs;
      }

      const tmpFile = configPath.replace(/\.ts$/, ".js");
      await fs.writeFile(tmpFile, outputFiles[0].text);

      try {
        const mod = await import(pathToFileURL(tmpFile).href);
        // await fs.unlink(tmpFile);
        console.log("MOD_DEFAULT", mod.default);
        return mod.default as LuxeConfig;
      } catch (error) {
        // await fs.unlink(tmpFile).catch(() => {});
        if (error instanceof LuxeError) {
          throw error;
        }
        throw LuxeErrors.Config.FailedToDynamicImport;
      }
    } catch (error) {
      if (error instanceof LuxeError) {
        throw error;
      }
      throw LuxeErrors.Config.FailedToBuildTs;
    }
  }

  try {
    const mod = (await import(fileUrl)) as { default?: LuxeConfig };
    return mod.default;
  } catch (error) {
    if (error instanceof LuxeError) {
      throw error;
    }
    throw LuxeErrors.Config.FailedToDynamicImport;
  }
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
  let projectRoot: string | null = null;
  try {
    projectRoot = await findProjectRoot(cwd);
  } catch (error) {
    if (error instanceof LuxeError) {
      throw error;
    }
    throw LuxeErrors.Config.NoRoot;
  }
  const configFiles = ["luxe.config.ts", "luxe.config.js", "luxe.config.mjs"];
  for (const file of configFiles) {
    const filePath = path.join(projectRoot, file);
    try {
      await fs.access(filePath);
      const config = await importConfigFile(filePath);
      console.log(config);
      if (!config) {
        throw LuxeErrors.Config.NoDefaultExport;
      }
      return config;
    } catch (error) {
      if (error instanceof LuxeError) {
        throw error;
      }
      throw LuxeErrors.Config.NoConfigFile;
    }
  }
  throw LuxeErrors.Config.NoConfigFile;
};
