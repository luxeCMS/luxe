import path from "node:path";
import kleur from "kleur";
import fs from "node:fs/promises";
import { parse } from "stacktrace-parser";

interface ErrorLocation {
  file: string;
  line: number;
  column: number;
  callerFile?: string;
  callerLine?: number;
  callerColumn?: number;
}

interface CodeFrame {
  line: number;
  code: string;
}

export class LuxeError extends Error {
  code: string;
  hint: string;
  name: string;
  location?: ErrorLocation;
  codeFrame?: CodeFrame[];

  /**
   * Create a new LuxeError
   * @param message the error message
   * @param code the error code
   */
  constructor(opts?: { message?: string; code?: string; hint?: string }) {
    const _message = opts?.message ?? "An unknown error occurred";
    const _code = opts?.code ?? "LUXE_UNKNOWN_ERROR_OCCURRED";
    const _hint =
      opts?.hint ?? "Sorry, you're on your own with this one. Good luck!";
    super(_message);
    this.code = _code;
    this.hint = _hint;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    this.location = this.#extractErrorLocation();
    this.#extractCodeFrame().catch(() => {});
  }

  /**
   * Find the location of the error in the code (file, line, column)
   * @returns an object representing the location of the error in the code
   */
  #extractErrorLocation(): ErrorLocation | undefined {
    const stack = this.stack;
    if (!stack) return undefined;

    const frames = parse(stack);
    const userFrames = frames
      .filter(
        (frame) =>
          !frame.file?.includes("node_modules") &&
          !frame.file?.includes("internal/"),
      )
      .slice(0, 2);

    if (userFrames.length === 0 || !userFrames[0].file) return undefined;

    return {
      file: path.relative(process.cwd(), userFrames[0].file),
      line: userFrames[0].lineNumber ?? 0,
      column: userFrames[0].column ?? 0,
      callerFile: userFrames[1]?.file
        ? path.relative(process.cwd(), userFrames[1].file)
        : undefined,
      callerLine: userFrames[1]?.lineNumber ?? undefined,
      callerColumn: userFrames[1]?.column ?? undefined,
    };
  }

  async #extractCodeFrame() {
    if (!this.location?.callerFile) return;

    try {
      const file = await fs.readFile(this.location.callerFile, "utf-8");
      const lines = file.split("\n");
      const errorLine = this.location.callerLine ?? 0;

      this.codeFrame = [];
      for (
        let i = Math.max(errorLine - 2, 0);
        i <= Math.min(errorLine + 2, lines.length);
        i++
      ) {
        this.codeFrame.push({
          line: i,
          code: lines[i - 1],
        });
      }
    } catch {}
  }

  private formatCodeFrame(): string {
    if (!this.codeFrame || !this.location?.callerLine) return "";

    const output: string[] = ["\n"];
    const padding = Math.max(
      ...this.codeFrame.map((f) => f.line.toString().length),
    );

    for (const { line, code } of this.codeFrame) {
      const lineNum = line.toString().padStart(padding);
      const isErrorLine = line === this.location?.callerLine;

      if (isErrorLine) {
        output.push(kleur.red(`  ${lineNum} │ ${code}`));
        const pointer = `${" ".repeat(
          (this.location?.callerColumn ?? 0) + padding + 3,
        )}^`;
        output.push(kleur.red(pointer));
      } else {
        output.push(kleur.dim(`  ${lineNum} │ ${code}`));
      }
    }

    return output.join("\n");
  }

  toString() {
    kleur.enabled = true;
    const header = kleur.red().bold("LuxeError:");
    const code = kleur.red().dim(`[${this.code}]`);
    const message = kleur.white().bold(this.message);
    const location = this.location?.callerFile
      ? `\n${kleur.dim(
          `  at ${this.location.callerFile}:${this.location.callerLine}:${this.location.callerColumn}`,
        )}`
      : "";
    const codeFrame = this.formatCodeFrame();
    const hint = kleur.yellow(`\nhint: ${this.hint}`);

    return `${header} ${code} ${message}${location}${codeFrame}${hint}\n`;
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      hint: this.hint,
      location: this.location,
      codeFrame: this.codeFrame,
      stack: this.stack?.split("\n").slice(1),
    };
  }
}

export const LuxeErrors = {
  Config: {
    NoRoot: new LuxeError({
      code: "NO_PROJECT_ROOT_FOUND",
      message: "Could not find the root of your project",
      hint: "Make sure you are running this command from within a Luxe project.",
    }),
    NoConfigFile: new LuxeError({
      code: "NO_CONFIG_FILE_FOUND",
      message: "Could not find a Luxe configuration file in your project root",
      hint: "Make sure you have a Luxe configuration file in the root of your project.",
    }),
    NoDefaultExport: new LuxeError({
      code: "NO_CONFIG_DEFAULT_EXPORT",
      message: "No default export found in configuration file",
      hint: "Did you forget to export the configuration object as 'default'?",
    }),
    Empty: new LuxeError({
      code: "EMPTY_CONFIG_OBJECT",
      message: "A valid object could not be found in the configuration file",
      hint: "Did you forget to call the 'defineLuxeConfig' function?",
    }),
    PropertyNotArray: (propertyType: string) =>
      new LuxeError({
        code: `CONFIG_${propertyType.toUpperCase()}_NOT_ARRAY`,
        message: `'${propertyType}' must be an array`,
        hint: `Make sure the '${propertyType}' property in your configuration file is an array.`,
      }),
    MissingRequiredProperty: (
      type: "module" | "plugin",
      propertyMissing: string,
    ) =>
      new LuxeError({
        code: `CONFIG_${type.toUpperCase()}_MISSING_REQUIRED_PROPERTY`,
        message: `All ${type}s must have a '${propertyMissing}' property`,
        hint: `Make sure all ${type}s in your configuration file have a valid '${propertyMissing}' property.`,
      }),
    DuplicateTypeName: (type: "module" | "plugin", name: string) =>
      new LuxeError({
        code: `DUPLICATE_${type.toUpperCase()}_NAME`,
        message: `Duplicate ${type} name: ${name}`,
        hint: `Make sure each ${type} in your configuration file has a unique name.`,
      }),
  },
} as const;
