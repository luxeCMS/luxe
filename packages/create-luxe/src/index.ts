import * as p from "@clack/prompts";
import color from "picocolors";
import {
  downloadLuxeExample,
  pingPostgres,
  readLuxeGithubExamplesDir,
  renamePackageName,
  setupEnvFile,
} from "./utils.js";
import { x } from "tinyexec";
import path from "node:path";
import fs from "node:fs/promises";

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
        p.cancel("Operation cancelled");
        process.exit(0);
      },
    },
  );

  const s = p.spinner();
  s.start("Pinging the database");
  const pingedDb = await pingPostgres(project.postgresUrl);
  if (!pingedDb) {
    s.stop("Could not connect to the database");
    p.cancel("Operation cancelled");
    process.exit(1);
  }
  s.stop("Pinged database successfully");

  s.start("Cloning template");
  const downloaded = await downloadLuxeExample(project.example, project.path);
  if (!downloaded) {
    s.stop("Failed to clone template");
    p.cancel("Operation cancelled");
    process.exit(1);
  }
  const renamed = await renamePackageName(project.path);
  if (!renamed) {
    s.stop("Failed to rename package");
  } else {
    s.stop("Cloned template");
  }

  s.start("Creating .env file");
  const envSetup = await setupEnvFile(project.path, project.postgresUrl);
  if (!envSetup) {
    s.stop("Failed to create .env file");
  } else {
    s.stop("Created .env file");
  }

  const ctx = {
    installed: false,
  };
  if (project.install) {
    const s = p.spinner();
    s.start("Installing dependencies");
    const absolutePath = path.join(process.cwd(), project.path);
    try {
      await x("cd", [absolutePath]);
      // TODO: auto detect what package manager the developer is using
      const result = await x("npm", ["install"]);
      if (result.exitCode !== 0) {
        throw new Error("Failed to install dependencies");
      }
      ctx.installed = true;
      s.stop("Installed via npm");
    } catch (error) {
      s.stop("Failed to install dependencies");
    }
  }

  const nextSteps = `cd ${project.path}        \n${
    ctx.installed ? "" : "pnpm install\n"
  }pnpm dev`;

  p.note(nextSteps, "Next steps.");

  p.outro("Have fun building with LuxeCMS! 🎉");
};
