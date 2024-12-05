import type { LuxeCoreConfig } from "..";
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
async function findProjectRoot(startPath: string): Promise<string> {
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
}

/**
 * Read the Luxe configuration file from the root of the project
 * @param cwd the current working directory (default: process.cwd())
 * @returns the LuxeCoreConfig object
 * @throws {LuxeConfigError} if the configuration file is not found or invalid
 */
export const readRootLuxeConfigFile = async (
  cwd = process.cwd(),
): Promise<LuxeCoreConfig> => {
  let projectRoot: string | null = null;
  try {
    projectRoot = await findProjectRoot(cwd);
  } catch (error) {
    if (error instanceof LuxeError) {
      throw error;
    }
    throw LuxeErrors.Config.NoRoot;
  }
  const configFiles = [
    "luxe.config.ts",
    "luxe.config.js",
    "luxe.config.mjs",
    "luxe.config.cjs",
  ];
  for (const file of configFiles) {
    const filePath = path.join(projectRoot, file);
    try {
      await fs.access(filePath);
      const fileUrl = pathToFileURL(filePath).href;
      console.log(fileUrl);
      const module = (await import(fileUrl)) as { default?: LuxeCoreConfig };
      if (!module.default) {
        throw LuxeErrors.Config.NoDefaultExport;
      }
      return module.default;
    } catch (error) {
      if (error instanceof LuxeError) {
        throw error;
      }
      throw LuxeErrors.Config.NoConfigFile;
    }
  }
  throw LuxeErrors.Config.NoConfigFile;
};
