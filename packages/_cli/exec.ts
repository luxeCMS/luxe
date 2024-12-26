import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { dev } from "./dev/index.js";
import { LuxeErrors } from "../core/errors/index.js";
import { migrateCreate, migrateDown, migrateUp } from "./migrate/index.js";

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
    .command(
      "migrate",
      "Run database migrations",
      (yargs) => {
        yargs.command(
          "create",
          "Create a new migration",
          (yargs) => {
            yargs.option("name", {
              alias: "n",
              type: "string",
              description: "The name of the migration",
              demandOption: true,
            });
          },
          migrateCreate,
        );
        yargs.command(
          "up",
          "Run all pending migrations",
          (yargs) => {
            yargs.option("count", {
              alias: "c",
              type: "number",
              description: "The number of migrations to run",
            });
          },
          migrateUp,
        );
        yargs.command(
          "down",
          "Rollback the last migration",
          (yargs) => {
            yargs.option("count", {
              alias: "c",
              type: "number",
              description: "The number of migrations to rollback",
            });
          },
          migrateDown,
        );
      },
      () => {
        console.error(LuxeErrors.CLI.SpecifyMigrateSubcommand().toString());
      },
    )
    .parse();
};
