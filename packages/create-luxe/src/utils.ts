import { downloadTemplate } from "@bluwy/giget-core";
import pg from "pg";

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
