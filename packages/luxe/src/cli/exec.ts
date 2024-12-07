import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { LuxeError } from "~/core/errors/index.js";
import { dev } from "./dev/index.js";

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
    .fail((msg, err, yargs) => {
      if (err) {
        if (err instanceof LuxeError) {
          console.error(err.toString());
        } else {
          console.error(err);
        }
      }
      yargs.showHelp();
    })
    .parse();
};
