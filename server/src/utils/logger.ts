import { requestContext } from "@fastify/request-context";
import { isProduction } from "@server/utils/envUtils";
import path from "node:path";
import pino, { Logger, LoggerOptions } from "pino";

// https://github.com/pinojs/pino/blob/main/docs/api.md#logger

type CustomLevels = "debugInfo";
const customLevels = {
  debugInfo: 25, // In between debug and info
};

function getLoggerSettings(): LoggerOptions<CustomLevels> {
  if (isProduction) {
    return {
      customLevels,
      useOnlyCustomLevels: false,
      level: "info",
    };
  }

  return {
    customLevels,
    useOnlyCustomLevels: false,
    level: "info",
    transport: {
      targets: [
        {
          level: "trace",
          target: "pino/file",
          options: {
            destination: path.join(__dirname, "../../.server-logs.log"),
            nestedKey: "payload",
          },
        },
        {
          level: "trace",
          target: "pino-pretty",
          options: {
            nestedKey: "payload",
          },
        },
      ],
    },
  };
}

export const pinoLogger = pino<CustomLevels>(getLoggerSettings());

let fallbackLogger: Logger<CustomLevels> = pinoLogger;
let isFastify = false;
export function initFastifyLogger(fallback: Logger<CustomLevels>) {
  fallbackLogger = fallback;
  isFastify = true;
}

function getLogger(): Logger<CustomLevels> {
  if (isFastify) {
    return requestContext.get("logger") ?? fallbackLogger;
  }
  return fallbackLogger;
}

//type MergingObject = undefined | { err?: Error } & unknown;
// TODO: Rethink this type
// https://github.com/pinojs/pino/blob/main/docs/api.md#error
type MergingObject = unknown;

export const logger = {
  debugSql(connection: number, query: string, params: number[], types: number[]): void {
    getLogger().debug({ connection, params, types }, query);
  },
  debug(msg?: string, obj?: MergingObject): void {
    getLogger().debug(obj, msg);
  },
  debugInfo(msg?: string, obj?: MergingObject): void {
    getLogger().debugInfo(obj, msg);
  },
  info(msg?: string, obj?: MergingObject): void {
    getLogger().info(obj, msg);
  },
  warn(msg?: string, obj?: MergingObject): void {
    getLogger().warn(obj, msg);
  },
  error(msg?: string, obj?: MergingObject | unknown): void {
    if (typeof obj === "string") {
      obj = { errMsg: obj };
    }
    getLogger().error(obj, msg);
  },
  pinoLogger: getLogger(),
};
