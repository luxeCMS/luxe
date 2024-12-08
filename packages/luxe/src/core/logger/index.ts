import { format } from "node:util";
import kleur from "kleur";
import { LuxeError } from "../errors/index.js";

/**
 * The log level for the logger. The log level determines which log messages
 * are logged. The log levels are ordered from least severe to most severe.
 * The log level "silent" will not log any messages.
 */
type LogLevel = "debug" | "info" | "warn" | "error" | "silent";

/**
 * The options for the logger. The options include the log level and prefix for
 * the logger. The log level determines which log messages are logged, and the
 * prefix is added to each log message.
 */
type LoggerOptions = {
  level?: LogLevel;
  prefix?: string;
};

/**
 * The Luxe logger. This is a simple logger that logs messages to the console.
 * It supports different log levels and prefixes.
 *
 * The logger is a singleton, so you can get the same instance of the logger
 * from anywhere in your code. Don't create new instances of the logger.
 */
export class LuxeLog {
  #level: LogLevel;
  #prefix: string;
  static #instance: LuxeLog | null = null;
  static LEVELS: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
    silent: 4,
  };

  private constructor(options: LoggerOptions = {}) {
    this.#level = options.level ?? "info";
    this.#prefix = options.prefix ?? "";
  }

  /**
   * Get the logger instance. If the logger instance doesn't exist, it will be
   * created with the given options. If the logger instance already exists, the
   * options will be set on the existing instance.
   *
   * @param options the options to set on the logger
   * @returns the logger instance
   */
  public static instance(options?: LoggerOptions): LuxeLog {
    if (!LuxeLog.#instance) {
      LuxeLog.#instance = new LuxeLog(options);
    } else if (options) {
      LuxeLog.#instance.setOptions(options);
    }
    return LuxeLog.#instance;
  }

  /**
   * Set the options on the logger instance. This will set the log level and
   * prefix for the logger.
   * @param options the options to set on the logger
   */
  public static setOptions(options?: LoggerOptions): void {
    LuxeLog.instance().setOptions(options);
  }

  /**
   * Set the log level for the logger instance. This will set the log level for
   * all log messages.
   * @param options the options to set on the logger
   */
  public setOptions(options?: LoggerOptions): void {
    this.#level = options?.level ?? this.#level;
    this.#prefix = options?.prefix ?? this.#prefix;
  }

  /**
   * Determine whether the logger should log messages at the given log level.
   * @param level the log level to check
   * @returns a boolean indicating whether the logger should log messages at
   */
  #shouldLog(level: LogLevel): boolean {
    return LuxeLog.LEVELS[level] >= LuxeLog.LEVELS[this.#level];
  }

  /**
   * Get the current timestamp in ISO 8601 format.
   * @returns the current timestamp
   */
  #getTimeStamp(): string {
    return kleur.dim(`[${new Date().toISOString()}] `);
  }

  /**
   * Format a log message with the given log level, message, and additional
   * arguments. This will add a timestamp, log level, and prefix to the message.
   * The message will be colorized based on the log level.
   *
   * @param level the log level
   * @param message the message to log
   * @param args any additional arguments to log
   * @returns the formatted log message
   */
  #formatMessage(level: LogLevel, message: string, ...args: unknown[]): string {
    const prefix = this.#prefix ? kleur.dim(`[${this.#prefix}] `) : "";
    const timestamp = this.#level === "debug" ? this.#getTimeStamp() : "";
    const formattedMessage = format(message, ...args);

    const levelColors: Record<LogLevel, (str: string) => string> = {
      debug: kleur.gray,
      info: kleur.blue,
      warn: kleur.yellow,
      error: kleur.red,
      silent: (str) => str,
    };

    const colorize = levelColors[level];
    const levelTag = colorize(level.toUpperCase().padEnd(5));

    return `${prefix}${timestamp}${levelTag} ${formattedMessage}`;
  }

  /**
   * Log a debug message. This will only log the message if the log level is set
   * to "debug".
   * @param message the message to log
   * @param args any additional arguments to log
   */
  debug(message: string, ...args: unknown[]) {
    if (this.#shouldLog("debug")) {
      console.log(this.#formatMessage("debug", message, ...args));
    }
  }

  /**
   * Log an info message. This will log the message if the log level is set to
   * "debug" or "info".
   * @param message the message to log
   * @param args any additional arguments to log
   */
  info(message: string, ...args: unknown[]) {
    if (this.#shouldLog("info")) {
      console.log(this.#formatMessage("info", message, ...args));
    }
  }

  /**
   * Log a warning message. This will log the message if the log level is set to
   * "debug", "info", or "warn".
   * @param message the message to log
   * @param args any additional arguments to log
   */
  warn(message: string, ...args: unknown[]) {
    if (this.#shouldLog("warn")) {
      console.warn(this.#formatMessage("warn", message, ...args));
    }
  }

  /**
   * Log an error message. This will log the message if the log level is set to
   * "debug", "info", "warn", or "error".
   *
   * This method is used to log errors. If the error is an instance of
   * `LuxeError`, it will be formatted and logged as a Luxe error. Otherwise,
   * the error will be formatted and logged as a generic error.
   *
   * @param error the error to log
   */
  error(error: Error) {
    if (this.#shouldLog("error")) {
      // LuxeErrors have their own formatting, so we don't need to format them
      if (LuxeError.isError(error)) {
        if (this.#level === "debug") {
          console.log(this.#getTimeStamp());
        }
        console.error(error.toString());
      } else {
        console.error(this.#formatMessage("error", error.toString()));
      }
    }
  }
}
