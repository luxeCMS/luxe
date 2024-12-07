import * as fs from "node:fs";

export const safeImport = async <T = unknown>(fileUrl: string) => {
  try {
    if (!fs.existsSync(fileUrl)) {
      throw new Error(`File not found: ${fileUrl}`);
    }
    const module = (await import(fileUrl)) as { default?: T };
    return module.default;
  } catch (error) {
    console.error(error);
  }
};
