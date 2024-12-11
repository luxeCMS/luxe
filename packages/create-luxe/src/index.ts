import * as p from "@clack/prompts";
import color from "picocolors";
import { pingPostgres } from "./utils.js";

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
      type: () =>
        p.confirm({
          message: "Would you like to use TypeScript?",
          initialValue: true,
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
  if (!pingedDb) {
    p.cancel("Could not connect to the database.");
    process.exit(1);
  }

  if (project.install) {
    const s = p.spinner();
    s.start("Installing dependencies...");

    s.stop("Installed via pnpm");
  }

  const nextSteps = `cd ${project.path}        \n${
    project.install ? "" : "pnpm install\n"
  }pnpm dev`;

  p.note(nextSteps, "Next steps.");

  p.outro(
    `Problems? ${color.underline(color.cyan("https://example.com/issues"))}`,
  );
};
