import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import ErrorStackParser from "error-stack-parser";
import kleur from "kleur";
import StackUtils from "stack-utils";

interface ErrorLocation {
  file: string;
  line: number;
  column: number;
}

interface ErrorOptions {
  code: string;
  message: string;
  docsUrl?: string;
  hint?: string;
  stack?: string;
  cause?: Error;
  location?: ErrorLocation;
}

type LuxeErrorFactoryFn = {
  (override?: Partial<ErrorOptions>): LuxeError;
  create(override?: Partial<ErrorOptions>): LuxeError;
};

/**
 * The LuxeError class.
 *
 * Handles all errors thrown by Luxe.
 */
export class LuxeError extends Error {
  public readonly code: string;
  public readonly hint: string;
  public readonly location?: ErrorLocation;
  public readonly cause?: Error;
  public readonly docsUrl?: string;
  readonly #stackUtils: StackUtils;
  static readonly #MAX_SNIPPET_LINES = 5;

  constructor(options: ErrorOptions) {
    super(options.message);
    this.name = "LuxeError";
    this.code = options.code;
    this.docsUrl = options.docsUrl;
    this.hint = options.hint || "";
    this.cause = options.cause;

    this.#stackUtils = new StackUtils({
      cwd: process.cwd(),
      internals: StackUtils.nodeInternals(),
    });

    Error.captureStackTrace(this, this.constructor);
    this.location = this.#parseErrorLocation();
  }

  /**
   * Check if an error is a LuxeError.
   *
   * Checks to see if the name of the error is "LuxeError"
   * because `instanceof` checks don't work across module boundaries
   * and dynamic imports.
   *
   * @param error the error to check
   * @returns true if the error is a LuxeError
   */
  public static isError(error: unknown): error is LuxeError {
    return (
      error !== null &&
      typeof error === "object" &&
      "name" in error &&
      error.name === "LuxeError"
    );
  }

  /**
   * Create a new error factory function.
   * @param options the options to create the error with
   * @returns a new error factory function
   */
  public static create(options: ErrorOptions): LuxeErrorFactoryFn {
    const factory = ((override?: Partial<ErrorOptions>): LuxeError => {
      const mergedOptions = {
        ...options,
        ...override,
      };
      return new LuxeError(mergedOptions);
    }) as LuxeErrorFactoryFn;

    factory.create = (override?: Partial<ErrorOptions>): LuxeError => {
      return factory(override);
    };

    return factory;
  }

  /**
   * Parse the location of the error in the code.
   *
   * This function uses the error stack to find the location
   * of the error in the code. It looks for the frame where
   * the error was thrown and returns the file, line, and column
   * of that frame.
   *
   * @returns the location of the error in the code
   */
  #parseErrorLocation(): ErrorLocation | undefined {
    try {
      const frames = ErrorStackParser.parse(this);

      // Find the index of the factory frame
      const factoryIndex = frames.findIndex((frame) => {
        const functionName = frame.functionName || "";
        return functionName.includes("factory");
      });

      // Get the next frame after the factory (where the error was actually thrown)
      const throwFrame =
        factoryIndex !== -1 && frames[factoryIndex + 1]
          ? frames[factoryIndex + 1]
          : frames[0]; // Fallback to first frame if pattern not found

      if (throwFrame) {
        const filePath = throwFrame.fileName || "";
        return {
          file: path.isAbsolute(filePath)
            ? filePath
            : path.resolve(process.cwd(), filePath),
          line: throwFrame.lineNumber || 0,
          column: throwFrame.columnNumber || 0,
        };
      }
    } catch (e) {
      // Silently fail if stack parsing fails
    }
    return undefined;
  }

  /**
   * Creates a pretty code snippet around the location of the error.
   *
   * This function reads the file where the error occurred and
   * creates a code snippet around the location of the error.
   * It highlights the line where the error occurred and adds
   * a caret to point to the exact column.
   *
   * @returns a code snippet around the location of the error
   */
  #getCodeSnippet(): string {
    if (!this.location?.file || !existsSync(this.location.file)) return "";

    try {
      const fileContent = readFileSync(this.location.file, "utf-8");
      const lines = fileContent.split("\n");
      const errorLine = this.location.line;

      const start = Math.max(errorLine - LuxeError.#MAX_SNIPPET_LINES, 0);
      const end = Math.min(
        errorLine + LuxeError.#MAX_SNIPPET_LINES,
        lines.length,
      );

      let snippet = "";
      const numberWidth = end.toString().length;

      snippet += kleur.dim(`${this.location.file}:\n\n`);

      for (let i = start; i < end; i++) {
        const lineNumber = i + 1;
        const isErrorLine = lineNumber === errorLine;
        const linePrefix = isErrorLine ? "› " : "  ";
        const gutterColor = isErrorLine ? kleur.red : kleur.dim;

        const lineContent = lines[i].trimEnd();
        const formattedLine = isErrorLine
          ? kleur.red().bold(lineContent)
          : lineContent;

        snippet += `${gutterColor(
          lineNumber.toString().padStart(numberWidth),
        )} ${linePrefix}${formattedLine}\n`;

        if (isErrorLine) {
          const indicator = `${" ".repeat(this.location.column - 1)}^`;
          snippet += `${" ".repeat(numberWidth)} ${kleur.red(indicator)}\n`;
        }
      }

      return snippet;
    } catch (e) {
      return "";
    }
  }

  /**
   * Convert the error to a string.
   *
   * This function converts the error to a string representation
   * that can be printed to the console. It includes the error
   * code, message, hint, docsUrl, and stack trace.
   *
   * @returns a string representation of the error
   */
  public toString(): string {
    const divider = kleur.dim("─".repeat(process.stdout.columns || 80));
    let output = `\n${divider}\n\n`;

    output += `${kleur.red().bold("LuxeError")} [${kleur
      .white()
      .bold(this.code)}]\n\n`;

    output += `${kleur.red(this.message)}\n\n`;

    if (this.location) {
      const snippet = this.#getCodeSnippet();
      if (snippet) {
        output += `${snippet}\n`;
      }
    }

    if (this.hint !== "") {
      output += kleur.yellow().bold("HINT: ");
      output += `${this.hint}\n`;
    }

    if (this.docsUrl) {
      output += `${kleur.dim().underline(this.docsUrl)}\n`;
    }

    const cleanStack = this.#stackUtils
      .clean(this.stack || "")
      .split("\n")
      .filter((line: string) => {
        // Filter out common noise
        return (
          !line.includes("node:internal/") &&
          !line.includes("/node_modules/stack-utils/") &&
          !line.includes("/node_modules/error-stack-parser/")
        );
      })
      .map((line: string) => kleur.dim(line))
      .join("\n");

    output += `\n${kleur.yellow().bold("Stack trace:")}\n\n`;
    output += `${cleanStack}\n`;

    output += `${divider}\n`;

    return output;
  }

  /**
   * Convert the error to a JSON object.
   * @returns the JSON representation of the error
   */
  toJSON() {
    return {
      code: this.code,
      message: this.message,
      hint: this.hint,
      docsUrl: this.docsUrl,
      location: this.location,
      stack: this.stack,
    };
  }
}

export const LuxeErrors = {
  Config: {
    /**
     * Use this error when the project root cannot be found.
     */
    NoRoot: LuxeError.create({
      code: "NO_PROJECT_ROOT_FOUND",
      message: "Could not find the root of project",
      hint: "Make sure you are running this command from within a Luxe project.",
    }),

    /**
     * Use this error when a configuration file is not found.
     */
    NoConfigFile: LuxeError.create({
      code: "NO_CONFIG_FILE_FOUND",
      message: "Could not find a Luxe configuration file in project root",
      hint: "Make sure you have a Luxe configuration file in the root of your project.",
    }),

    /**
     * Use this error when a configuration file has no default export.
     */
    NoDefaultExport: LuxeError.create({
      code: "NO_CONFIG_DEFAULT_EXPORT",
      message: "No default export found in configuration file",
      hint: "Did you forget to export the configuration object as 'default'?",
    }),

    /**
     * Use this error when a configuration file has an empty object.
     */
    Empty: LuxeError.create({
      code: "EMPTY_CONFIG_OBJECT",
      message: "A valid object could not be found in the configuration file",
      hint: "Did you forget to call the 'defineLuxeConfig' function?",
    }),

    /**
     * Use this error when a configuration file has an property that is not an array.
     *
     * Don't forget to call the factory function to create the error.
     *
     * @param propertyType the type of property that is not an array
     * @returns a LuxeError factory
     */
    PropertyNotArray: (propertyType: string) =>
      LuxeError.create({
        code: `CONFIG_${propertyType.toUpperCase()}_NOT_ARRAY`,
        message: `'${propertyType}' must be an array`,
        hint: `Make sure the '${propertyType}' property in your configuration file is an array.`,
      }),

    /**
     * Use this error when a configuration file has a missing required property.
     *
     * Don't forget to call the factory function to create the error.
     *
     * @param type the type of module or plugin
     * @param propertyMissing the property that is missing
     * @returns a LuxeError factory
     */
    MissingRequiredProperty: (
      type: "module" | "plugin",
      propertyMissing: string,
    ) =>
      LuxeError.create({
        code: `CONFIG_${type.toUpperCase()}_MISSING_REQUIRED_PROPERTY`,
        message: `All ${type}s must have a '${propertyMissing}' property`,
        hint: `Make sure all ${type}s in your configuration file have a valid '${propertyMissing}' property.`,
      }),

    /**
     * Use this error when a configuration file has a duplicate name.
     * @param type the type of module or plugin
     * @param name the name of the module or plugin
     * @returns a LuxeError factory
     */
    DuplicateTypeName: (type: "module" | "plugin", name: string) =>
      LuxeError.create({
        code: `DUPLICATE_${type.toUpperCase()}_NAME`,
        message: `Duplicate ${type} name: ${name}`,
        hint: `Make sure each ${type} in your configuration file has a unique name.`,
      }),

    /**
     * Use this error when a typescript configuration file has a syntax error.
     */
    FailedToBuildTs: LuxeError.create({
      code: "FAILED_TO_BUILD_TS",
      message: "Failed to build typescript configuration file",
      hint: "Do you happen to have a syntax error in your configuration file?",
    }),

    /**
     * Use this error when a configuration file cannot be dynamically imported.
     */
    FailedToDynamicImport: LuxeError.create({
      code: "FAILED_TO_DYNAMIC_IMPORT",
      message: "Failed to dynamically import configuration file",
      hint: "Do you happen to have a syntax error in your configuration file?",
    }),

    /**
     * Use this error when a configuration file cannot be parsed.
     */
    FailedToParse: LuxeError.create({
      code: "FAILED_TO_PARSE_CONFIG",
      message: "Failed to parse configuration file",
      hint: "Do you happen to have a syntax error in your configuration file?",
    }),

    /**
     * Use this error when a configuration file has an invalid postgres URL.
     */
    InvalidPostgresUrl: LuxeError.create({
      code: "INVALID_POSTGRES_URL",
      message: "Invalid PostgreSQL URL",
      hint: "Make sure the 'postgresUrl' property in your configuration file is a valid PostgreSQL URL.",
    }),

    /**
     * Use this error when a configuration file has an invalid hook.
     * @param hook the name of the hook
     * @returns a LuxeError factory
     */
    InvalidHook: (hook: string) =>
      LuxeError.create({
        code: "INVALID_HOOK",
        message: `Invalid hook: ${hook}`,
        hint: "Review the documentation for the available hooks and make sure you are using the correct hook name.",
      }),
  },
} as const;
