import * as esbuild from "esbuild";
import { glob } from "glob";

async function build(...args) {
  const isDev = args.includes("IS_DEV");
  const entryPoints = await glob(["src/**/index.ts", "src/**/luxe.ts"], {
    absolute: true,
  });

  const baseConfig = {
    entryPoints,
    bundle: true,
    platform: "node",
    target: "node18",
    sourcemap: isDev,
    minify: !isDev,
    packages: "external",
  };

  try {
    if (isDev) {
      const ctx = await esbuild.context({
        ...baseConfig,
        format: "esm",
        outdir: "dist/esm",
        outExtension: { ".js": ".mjs" },
        plugins: [
          {
            name: "watch-plugin",
            setup(build) {
              build.onStart(() => {
                console.log(
                  `Build started at ${new Date().toLocaleTimeString()}`,
                );
              });
              build.onEnd((result) => {
                console.log(
                  `Build ended at ${new Date().toLocaleTimeString()}`,
                );
                if (result.errors.length > 0) {
                  console.error("Build errors:", result.errors);
                }
                if (result.warnings.length > 0) {
                  console.warn("Build warnings:", result.warnings);
                }
              });
            },
          },
        ],
      });

      await ctx.watch();
      console.log("Watching for changes...");

      process.on("SIGTERM", () => ctx.dispose());
      process.on("SIGINT", () => ctx.dispose());
    } else {
      await Promise.all([
        esbuild.build({
          ...baseConfig,
          format: "esm",
          outdir: "dist/esm",
          outExtension: { ".js": ".mjs" },
        }),
        esbuild.build({
          ...baseConfig,
          format: "cjs",
          outdir: "dist/cjs",
          outExtension: { ".js": ".cjs" },
        }),
      ]);
      console.log("Build completed");
    }
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
}

export default build;
