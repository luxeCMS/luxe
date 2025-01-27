import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { dev } from "astro";
import { LuxeError } from "../../core/errors/index.js";
import type { LuxeConfig, LuxeRoute } from "../../types/index.js";

export type LuxeAstroConfig = {
  routes: Array<LuxeRoute>;
};

export const astroDev = async (
  astroConfig: LuxeConfig["astro"],
  luxeAstroConfig: LuxeAstroConfig,
): ReturnType<typeof dev> => {
  try {
    const currentDir = dirname(fileURLToPath(import.meta.url))
      .split("/")
      .slice(0, -1)
      .join("/");
    const devServer = await dev({
      srcDir: currentDir,
      root: currentDir,
      output: "server",
      integrations: [
        {
          name: "luxe-server",
          hooks: {
            "astro:config:setup": async (config) => {
              for (const route of luxeAstroConfig.routes) {
                console.log(route);
                config.injectRoute({
                  pattern: `${route.type}/${route.pattern}`,
                  entrypoint: route.entrypoint,
                });
              }
            },
          },
        },
      ],
      server: {
        port: 5893,
      },
      ...Object.fromEntries(
        Object.entries(astroConfig ?? {}).filter(
          ([key]) => key !== "root" && key !== "srcDir" && key !== "output",
        ),
      ),
    });
    return devServer;
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
