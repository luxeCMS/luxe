import * as p from "@clack/prompts";
import color from "picocolors";
import { pingPostgres, readLuxeGithubExamplesDir } from "./utils.js";
import { x } from "tinyexec";

export const main = async () => {
  console.clear();

  p.intro(`${color.bgCyan(color.black(" create-luxe "))}`);

  const project = await p.group(
    {
      path: () =>
        p.text({
          message: "Where should we create your project?",
          placeholder: "./luxecms",
          initialValue: "./luxecms",
          validate: (value) => {
            if (!value) {
              return "Please enter a path.";
            }
            if (value[0] !== ".") {
              return "Please enter a relative path.";
            }
          },
        }),
      example: async () => {
        const s = p.spinner();
        s.start("Loading templates");
        const examples = await readLuxeGithubExamplesDir();
        if (examples.length === 0) {
          s.stop();
          p.cancel(
            "Failed to fetch templates. Are you connected to the internet?",
          );
          process.exit(0);
        }
        s.stop("Loaded templates");
        return p.select({
          message: "Which template would you like to use?",
          options: examples.map((e) => ({ value: e.name, label: e.label })),
        });
      },
      postgresUrl: () =>
        p.text({
          message: "What PostgreSQL database should we connect to?",
          validate: (value) => {
            if (!value) {
              return "Please enter a PostgreSQL connection string.";
            }
            if (
              !/(postgres(?:ql)?):\/\/(?:([^@\s]+)@)?([^\/\s]+)(?:\/(\w+))?(?:\?(.+))?/.test(
                value,
              )
            ) {
              return "Please enter a valid PostgreSQL connection string.";
            }
          },
        }),
      install: () =>
        p.confirm({
          message: "Install dependencies?",
          initialValue: false,
        }),
    },
    {
      onCancel: () => {
        p.cancel("Operation cancelled.");
        process.exit(0);
      },
    },
  );

  const pingedDb = await pingPostgres(project.postgresUrl);
  const s = p.spinner();
  s.start("Pinging the database...");
  if (!pingedDb) {
    s.stop("Could not connect to the database.");
    p.cancel("Operation cancelled.");
    process.exit(1);
  }
  s.stop("Pinged database successfully.");

  if (project.install) {
    const s = p.spinner();
    s.start("Installing dependencies...");
    // TODO: auto detect what package manager the developer is using
    await x("npm", ["install"]);
    s.stop("Installed via npm");
  }

  const nextSteps = `cd ${project.path}        \n${
    project.install ? "" : "pnpm install\n"
  }pnpm dev`;

  p.note(nextSteps, "Next steps.");

  p.outro("Have fun building with LuxeCMS! 🎉");
};
