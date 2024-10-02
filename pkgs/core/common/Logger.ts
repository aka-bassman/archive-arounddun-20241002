import dayjs from "dayjs";
import type { LoggerService } from "@nestjs/common";

const logLevels = ["trace", "verbose", "debug", "log", "info", "warn", "error"] as const;
type LogLevel = (typeof logLevels)[number];

const clc = {
  bold: (text: string) => `\x1B[1m${text}\x1B[0m`,
  green: (text: string) => `\x1B[32m${text}\x1B[39m`,
  yellow: (text: string) => `\x1B[33m${text}\x1B[39m`,
  red: (text: string) => `\x1B[31m${text}\x1B[39m`,
  magentaBright: (text: string) => `\x1B[95m${text}\x1B[39m`,
  cyanBright: (text: string) => `\x1B[96m${text}\x1B[39m`,
};

const colorizeMap: { [key in LogLevel]: (text: string) => string } = {
  trace: clc.bold,
  verbose: clc.cyanBright,
  debug: clc.magentaBright,
  log: clc.green,
  info: clc.green,
  warn: clc.yellow,
  error: clc.red,
};

export class Logger implements LoggerService {
  static #level: LogLevel = (process.env.NEXT_PUBLIC_LOG_LEVEL as LogLevel | undefined) ?? "log";
  static #levelIdx = logLevels.findIndex((l) => l === process.env.NEXT_PUBLIC_LOG_LEVEL);
  static #startAt = dayjs();
  static setLevel(level: LogLevel) {
    this.#level = level;
    this.#levelIdx = logLevels.findIndex((l) => l === level);
  }

  name?: string;
  constructor(name?: string) {
    this.name = name;
  }
  trace(msg: string, context = "") {
    if (Logger.#levelIdx <= 0) Logger.#printMessages(this.name ?? "App", msg, context, "trace");
  }
  verbose(msg: string, context = "") {
    if (Logger.#levelIdx <= 1) Logger.#printMessages(this.name ?? "App", msg, context, "verbose");
  }
  debug(msg: string, context = "") {
    if (Logger.#levelIdx <= 2) Logger.#printMessages(this.name ?? "App", msg, context, "debug");
  }
  log(msg: string, context = "") {
    if (Logger.#levelIdx <= 3) Logger.#printMessages(this.name ?? "App", msg, context, "log");
  }
  info(msg: string, context = "") {
    if (Logger.#levelIdx <= 4) Logger.#printMessages(this.name ?? "App", msg, context, "info");
  }
  warn(msg: string, context = "") {
    if (Logger.#levelIdx <= 5) Logger.#printMessages(this.name ?? "App", msg, context, "warn");
  }
  error(msg: string, context = "") {
    if (Logger.#levelIdx <= 6) Logger.#printMessages(this.name ?? "App", msg, context, "error");
  }
  static trace(msg: string, context = "") {
    if (Logger.#levelIdx <= 0) Logger.#printMessages("App", msg, context, "trace");
  }
  static verbose(msg: string, context = "") {
    if (Logger.#levelIdx <= 1) Logger.#printMessages("App", msg, context, "verbose");
  }
  static debug(msg: string, context = "") {
    if (Logger.#levelIdx <= 2) Logger.#printMessages("App", msg, context, "debug");
  }
  static log(msg: string, context = "") {
    if (Logger.#levelIdx <= 3) Logger.#printMessages("App", msg, context, "log");
  }
  static info(msg: string, context = "") {
    if (Logger.#levelIdx <= 4) Logger.#printMessages("App", msg, context, "info");
  }
  static warn(msg: string, context = "") {
    if (Logger.#levelIdx <= 5) Logger.#printMessages("App", msg, context, "warn");
  }
  static error(msg: string, context = "") {
    if (Logger.#levelIdx <= 6) Logger.#printMessages("App", msg, context, "error");
  }
  static #colorize(msg: string, logLevel: LogLevel) {
    return colorizeMap[logLevel](msg);
  }
  static #printMessages(
    name: string | undefined,
    content: string,
    context: string,
    logLevel: LogLevel,
    writeStreamType: "stdout" | "stderr" = logLevel === "error" ? "stderr" : "stdout"
  ) {
    const now = dayjs();
    const processMsg = this.#colorize(
      `[${name ?? "App"}] ${(process.pid as unknown as string | undefined) ?? "window"} -`,
      logLevel
    );
    const timestampMsg = now.format("MM/DD/YYYY, HH:mm:ss A");
    const logLevelMsg = this.#colorize(logLevel.toUpperCase().padStart(7, " "), logLevel);
    const contextMsg = context ? clc.yellow(`[${context}] `) : "";
    const contentMsg = this.#colorize(content, logLevel);
    const timeDiffMsg = clc.yellow(`+${now.diff(Logger.#startAt, "ms")}ms`);
    if (typeof window === "undefined")
      process[writeStreamType].write(
        `${processMsg} ${timestampMsg} ${logLevelMsg} ${contextMsg} ${contentMsg} ${timeDiffMsg}\n`
      );
    // eslint-disable-next-line no-console
    else console.log(`${processMsg} ${timestampMsg} ${logLevelMsg} ${contextMsg} ${contentMsg} ${timeDiffMsg}\n`);
  }
}
