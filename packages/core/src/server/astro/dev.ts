import { type AstroUserConfig, dev as astroDev } from "astro";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { LuxeError } from "../../core/errors/index.js";
import type { LuxeConfig } from "../../core/index.js";

export const dev = async (options: LuxeConfig) => {
  try {
    await astroDev({
      srcDir: path.join(
        fileURLToPath(new URL("../../src/astro", import.meta.url)),
      ),
      root: path.join(
        fileURLToPath(new URL("../../src/astro", import.meta.url)),
      ),
      output: "server",
      server: {
        port: 5893,
      },
      ...Object.fromEntries(
        Object.entries(options.astro ?? {}).filter(
          ([key]) => key !== "root" && key !== "srcDir" && key !== "output",
        ),
      ),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new LuxeError({
      cause: error as Error,
      code: "ASTRO_DEV_FAILED",
      message: `Failed to start Astro dev server: ${message}`,
      stack: error instanceof Error ? error.stack : undefined,
    });
  }
};
