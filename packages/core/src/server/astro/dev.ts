import { dev } from "astro";
import { LuxeError } from "../../core/errors/index.js";
import type { LuxeConfig } from "../../core/index.js";

export const astroDev = async (
  astroConfig: LuxeConfig["astro"],
): ReturnType<typeof dev> => {
  try {
    const devServer = await dev({
      srcDir: "./",
      root: "./",
      output: "server",
      integrations: [
        {
          name: "luxe-server",
          hooks: {
            "astro:config:setup": async (config) => {
              config.injectRoute({
                pattern: "/admin/[...slug]",
                entrypoint: "./pages/admin.astro",
              });
              config.injectRoute({
                pattern: "/api/[...slug]",
                entrypoint: "./pages/api.ts",
              });
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
