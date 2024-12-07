import kleur from "kleur";
import { format } from "node:util";
import type { WriteStream } from "node:fs";

type LogLevel = "debug" | "info" | "warn" | "error" | "silent";
type LoggerOptions = {
  level?: LogLevel;
  prefix?: string;
  dest?: WriteStream | NodeJS.WriteStream;
};

export class Logger {
  private level: LogLevel;
  private prefix: string;
  private dest: WriteStream | NodeJS.WriteStream;

  static LEVELS: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
    silent: 4,
  };

  constructor(options: LoggerOptions = {}) {
    this.level = options.level ?? "info";
    this.prefix = options.prefix ?? "";
    this.dest = options.dest ?? process.stdout;
  }

  private shouldLog(level: LogLevel): boolean {
    return Logger.LEVELS[level] >= Logger.LEVELS[this.level];
  }

  private formatMessage(
    level: LogLevel,
    message: string,
    ...args: unknown[]
  ): string {
    const prefix = this.prefix ? kleur.dim(`[${this.prefix}] `) : "";
    const timestamp =
      process.env.NODE_ENV === "development"
        ? kleur.dim(`[${new Date().toISOString()}] `)
        : "";
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

  debug(message: string, ...args: unknown[]) {
    if (this.shouldLog("debug")) {
      console.log(this.formatMessage("debug", message, ...args));
    }
  }

  info(message: string, ...args: unknown[]) {
    if (this.shouldLog("info")) {
      console.log(this.formatMessage("info", message, ...args));
    }
  }

  warn(message: string, ...args: unknown[]) {
    if (this.shouldLog("warn")) {
      console.warn(this.formatMessage("warn", message, ...args));
    }
  }

  error(message: string, ...args: unknown[]) {
    if (this.shouldLog("error")) {
      console.error(this.formatMessage("error", message, ...args));
    }
  }

  fork(prefix: string): Logger {
    return new Logger({
      level: this.level,
      prefix: this.prefix ? `${this.prefix}:${prefix}` : prefix,
      dest: this.dest,
    });
  }

  time(label: string) {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.info(`${label} completed in ${Math.round(duration)}ms`);
    };
  }
}

let logger: Logger | null = null;

export const useLogger = (options: LoggerOptions = {}): Logger => {
  if (!logger) {
    logger = new Logger(options);
  }
  return logger;
};
