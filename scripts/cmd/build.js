import * as esbuild from "esbuild";
import { glob } from "glob";
import kleur from "kleur";

async function build(...args) {
  const isDev = args.includes("IS_DEV");
  const isVerbose = args.includes("--verbose");
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

  const log = {
    info: (msg) => console.log(kleur.blue().bold("¡ ") + msg),
    success: (msg) => console.log(kleur.green().bold("✓ ") + msg),
    warn: (msg) => console.log(kleur.yellow().bold("⚠ ") + msg),
    error: (msg) => console.log(kleur.red().bold("✖ ") + msg),
    verbose: (msg) => isVerbose && console.log(kleur.gray().dim("v ") + msg),
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
                isVerbose &&
                  log.verbose(
                    `Build started at ${new Date().toLocaleTimeString()}`,
                  );
              });

              build.onEnd((result) => {
                if (result.errors.length > 0) {
                  log.error("Build failed");
                  for (const err of result.errors) {
                    log.error(err.text);
                  }
                  return;
                }

                log.success("Build completed");

                if (result.warnings.length > 0) {
                  for (const warn of result.warnings) {
                    log.warn(warn.text);
                  }
                }

                if (isVerbose) {
                  log.verbose(
                    `Completed at ${new Date().toLocaleTimeString()}`,
                  );
                  for (const file of result.outputFiles) {
                    log.verbose(`Generated: ${file.path}`);
                  }
                }
              });
            },
          },
        ],
      });

      await ctx.watch();
      log.info("Watching for changes...");

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
      log.success("Build completed");
    }
  } catch (error) {
    log.error("Build failed:");
    log.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

export default build;
