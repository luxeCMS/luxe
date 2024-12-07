import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { dev } from "./dev/index.js";

/**
 * This is the real entry point of the CLI. It uses yargs to parse the
 * command line arguments and then runs the appropriate command.
 */
export const exec = () => {
  return yargs(hideBin(process.argv))
    .scriptName("luxe")
    .usage("$0 <cmd> [args]")
    .option("verbose", {
      alias: "v",
      type: "boolean",
      description: "Run with verbose logging",
    })
    .command(
      "dev",
      "Start the development server",
      (yargs) => {
        yargs.option("port", {
          alias: "p",
          type: "number",
          description: "The port to run the server on",
          default: 3000,
        });
      },
      dev,
    )
    .parse();
};
