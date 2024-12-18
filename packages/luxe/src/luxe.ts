import { exec } from "./cli/exec.js";

/**
 * Where the magic happens. Well, sort of.
 *
 * This is the main entry point for the Luxe CLI.
 *
 * @returns void
 */
const main = async () => {
  await exec();
};

main();
