import { default as libPath } from "node:path";
import fs from "node:fs";
import * as esbuild from "esbuild";
import { glob } from "glob";
import kleur from "kleur";
import { x } from "tinyexec";

async function build(...args) {
  const isDev = args.includes("--dev");
  const isVerbose = args.includes("--verbose");
  const dts = args.includes("--dts");
  const runServer = args.includes("--server");
  const joinedArgs = args.join(" ");
  const astroBuild = /--astroPages=[^ ]*/
    .exec(joinedArgs)?.[0]
    .trim()
    .replace("--astroPages=", "");
  const path = /--path=[^ ]*/
    .exec(joinedArgs)?.[0]
    .trim()
    .replace("--path=", "");
  const tsconfig = /--tsconfig=[^ ]*/
    .exec(joinedArgs)?.[0]
    .trim()
    .replace("--tsconfig=", "");
  const entryPoints = await glob(["src/**/index.ts", "src/**/luxe.ts"], {
    absolute: true,
  });

  const baseConfig = {
    entryPoints,
    bundle: true,
    platform: "node",
    target: "node20",
    sourcemap: isDev,
    minify: !isDev,
    packages: "external",
  };

  const log = {
    debug: (msg) => isVerbose && console.log(kleur.gray().dim("⚑ ") + msg),
    info: (msg) => console.log(kleur.blue().bold("¡ ") + msg),
    success: (msg) => console.log(kleur.green().bold("✓ ") + msg),
    warn: (msg) => console.log(kleur.yellow().bold("⚠ ") + msg),
    error: (msg) => console.log(kleur.red().bold("✖ ") + msg),
    verbose: (msg) => isVerbose && console.log(kleur.gray().dim("% ") + msg),
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

              build.onEnd(async (result) => {
                if (result.errors.length > 0) {
                  log.error("Build failed");
                  for (const err of result.errors) {
                    log.error(err.text);
                  }
                  return;
                }

                if (astroBuild) {
                  const astroPagesPath = libPath.join(
                    libPath.dirname(process.cwd()),
                    astroBuild,
                  );
                  if (!fs.existsSync(astroPagesPath)) {
                    log.error("Astro pages path does not exist");
                  } else {
                    const distPath = libPath.join(
                      libPath.dirname(process.cwd()),
                      astroBuild.split("/")[1],
                      "dist",
                    );
                    await x("cp", ["-r", astroPagesPath, distPath]);
                  }
                  log.debug("Building Astro");
                }

                if (dts) {
                  log.debug("Generating type definitions");
                  await x("tsc", ["--emitDeclarationOnly", "--declaration"]);
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

      log.info("Watching for changes...");
      await ctx.watch();

      process.on("SIGTERM", () => ctx.dispose());
      process.on("SIGINT", () => ctx.dispose());
    } else {
      await Promise.all([
        esbuild.build({
          ...baseConfig,
          format: "esm",
          outdir: "dist/esm",
          outExtension: { ".js": ".mjs" },
          ...(path ? { entryPoints: [`${path}/**/*.ts`] } : {}),
        }),
        esbuild.build({
          ...baseConfig,
          format: "cjs",
          outdir: "dist/cjs",
          outExtension: { ".js": ".cjs" },
          ...(path ? { entryPoints: [`${path}/**/*.ts`] } : {}),
        }),
        (async () => {
          if (astroBuild) {
            const astroPagesPath = libPath.join(
              libPath.dirname(process.cwd()),
              astroBuild,
            );
            if (!fs.existsSync(astroPagesPath)) {
              log.error("Astro pages path does not exist");
            } else {
              const distPath = libPath.join(
                libPath.dirname(process.cwd()),
                astroBuild.split("/")[1],
                "dist",
              );
              await x("cp", ["-r", astroPagesPath, distPath]);
            }
            log.debug("Building Astro");
          }
          if (dts) {
            log.info("Generating type definitions");
            if (tsconfig) {
              await x("tsc", [
                "--emitDeclarationOnly",
                "--declaration",
                "--project",
                tsconfig,
              ]);
            } else {
              await x("tsc", ["--emitDeclarationOnly", "--declaration"]);
            }
          }
        })(),
      ]);

      if (runServer) {
        try {
          await x("vinxi", ["build"]);
        } catch (error) {
          log.error("Failed to build server");
          log.error(error instanceof Error ? error.message : String(error));
        }
      }

      log.success("Build completed");
    }
  } catch (error) {
    log.error("Build failed:");
    log.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

export default build;
