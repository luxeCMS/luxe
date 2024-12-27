import { defineCommand, runMain } from "citty";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const packageJson = JSON.parse(
  fs.readFileSync(
    fileURLToPath(new URL("../package.json", import.meta.url)),
    "utf-8",
  ),
);

const main = defineCommand({
  meta: {
    name: "luxe",
    version: packageJson.version,
    description:
      "LuxeCMS: The first truly composable headless CMS built for the modular web.",
  },
  args: {
    config: {
      alias: "c",
      type: "string",
      description: "Path to the Luxe config file (default: luxe.config.ts)",
    },
    verbose: {
      alias: "v",
      type: "boolean",
      description: "Run with verbose logging",
    },
    version: {
      alias: "V",
      type: "boolean",
      description: "Print the version number",
    },
  },
  subCommands: () => ({
    dev: {
      meta: {
        name: "dev",
        version: packageJson.version,
        description: "Start the development server",
      },
      args: {
        port: {
          alias: "p",
          type: "number",
          description: "The port to run the server on (default: 5893)",
        },
      },
      async run({ args }) {
        const { dev } = await import("./cmd/index.js");
        await dev({
          port: args.port ?? 5893,
          verbose: args.verbose ?? false,
        });
      },
    },
    build: {},
    start: {},
    db: {},
  }),
});

runMain(main);
