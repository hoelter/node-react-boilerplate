import { pino } from "pino";
import path from "node:path";
import { isProduction } from "@server/utils/envUtils";
// https://github.com/pinojs/pino/blob/main/docs/api.md#logger

let pinoLogger = pino({ level: "info" });

if (!isProduction) {
  const transport = pino.transport({
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
  });

  pinoLogger = pino({ level: "debug" }, transport);
}

//type MergingObject = undefined | { err?: Error } & unknown;
// TODO: Rethink this type
// https://github.com/pinojs/pino/blob/main/docs/api.md#error
type MergingObject = unknown;

export const logger = {
  debugSql(connection: number, query: string, params: number[], types: number[]): void {
    pinoLogger.debug({ connection, params, types }, query);
  },
  debug(msg?: string, obj?: MergingObject): void {
    pinoLogger.debug(obj, msg);
  },
  info(msg?: string, obj?: MergingObject): void {
    pinoLogger.info(obj, msg);
  },
  warn(msg?: string, obj?: MergingObject): void {
    pinoLogger.warn(obj, msg);
  },
  error(msg?: string, obj?: MergingObject | unknown): void {
    if (typeof obj === "string") {
      obj = { errMsg: obj };
    }
    pinoLogger.error(obj, msg);
  },
  pinoLogger: pinoLogger,
};
