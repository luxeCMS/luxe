import { downloadTemplate } from "@bluwy/giget-core";
import fs from "node:fs/promises";
import path from "node:path";
import pg from "pg";
import { x } from "tinyexec";

export async function pingPostgres(
  connectionString: string,
  timeout = 5000,
): Promise<boolean> {
  const client = new pg.Client({
    connectionString,
    connectionTimeoutMillis: timeout,
    keepAlive: false,
  });

  try {
    await client.connect();
    await client.query("SELECT 1");
    return true;
  } catch (error) {
    return false;
  } finally {
    try {
      await client.end();
    } catch {}
  }
}

export async function readLuxeGithubExamplesDir() {
  try {
    const response = await fetch(
      "https://api.github.com/repos/luxeCMS/luxe/contents/examples?ref=main",
    );
    const data = (await response.json()) as Array<{
      name: string; // we only really care about this
      path: string;
      sha: string;
      size: number;
      url: string;
      html_url: string;
      git_url: string;
      download_url: string | null;
      type: string;
      _links: {
        self: string;
        git: string;
        html: string;
      };
    }>;
    return data
      .filter((obj) => !obj.name.startsWith("_"))
      .map((d) => ({
        name: d.name,
        label: d.name
          .replace("_js", " (JavaScript)")
          .replace("_ts", " (Typescript)")
          .split("-")
          .map((word, index) => {
            if (index === 0) {
              return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            }
            return word.charAt(0).toUpperCase() + word.slice(1);
          })
          .join(" "),
      }));
  } catch (error) {
    return [];
  }
}

export async function downloadLuxeExample(
  exampleName: string,
  destination: string,
) {
  try {
    await downloadTemplate(`luxeCMS/luxe/examples/${exampleName}#main`, {
      dir: destination,
      force: true,
    });
    return true;
  } catch {
    return false;
  }
}

export const renamePackageName = async (destPath: string) => {
  try {
    // replace the name inside package.json with the last part of the path
    const absolutePath = path.join(process.cwd(), destPath);
    const fileContents = await fs.readFile(
      `${absolutePath}/package.json`,
      "utf8",
    );
    const packageJson = JSON.parse(fileContents);
    packageJson.name = destPath.split("/").pop();
    await fs.writeFile(
      `${absolutePath}/package.json`,
      JSON.stringify(packageJson, null, 2),
    );
    return true;
  } catch {
    return false;
  }
};

export const setupEnvFile = async (
  projectPath: string,
  postgresUrl: string,
) => {
  const envPath = path.join(process.cwd(), projectPath, ".env");
  const newEnvContent = `POSTGRES_URL=${postgresUrl}`;
  const envExamplePath = path.join(process.cwd(), projectPath, ".env.example");
  try {
    let envContents: string;
    try {
      envContents = await fs.readFile(envExamplePath, "utf8");
    } catch {
      envContents = "";
    }
    let newContents: string;
    try {
      newContents = envContents.replace(
        /POSTGRES_URL=postgres:\/\/[^@\s]+@[^\/\s]+\/\w+/,
        newEnvContent,
      );
    } catch {
      newContents = newEnvContent;
    }
    await fs.writeFile(envPath, newContents);
    return true;
  } catch (error) {
    return false;
  }
};

export const installDependencies = async (projectPath: string) => {
  const absolutePath = path.join(process.cwd(), projectPath);
  try {
    // TODO: auto detect what package manager the developer is using
    const result = await x("npm", ["install", "--prefix", absolutePath]);
    if (result.exitCode !== 0) {
      throw new Error("Failed to install dependencies");
    }
    return true;
  } catch (error) {
    return false;
  }
};
