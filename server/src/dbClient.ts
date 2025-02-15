import { envVars } from "@server/utils/envUtils";
import { logger } from "@server/utils/logger";
import { postgresDataTypes } from "@server/constants/postgresConstants";
import { IsoDateTime } from "@shared/types";
import postgres from "postgres";

export const sql = postgres(envVars.DATABASE_URL, {
  debug: logger.debugSql,
  transform: postgres.camel,
  types: {
    date: {
      // https://github.com/porsager/postgres/blob/master/src/types.js#L31
      // https://github.com/porsager/postgres/issues/161
      to: postgresDataTypes.timestamptz,
      from: [postgresDataTypes.date, postgresDataTypes.timestamp, postgresDataTypes.timestamptz],
      serialize: (x: string | Date) => (x instanceof Date ? x : new Date(x)).toISOString(),
      parse: (x: string) => x as IsoDateTime,
    },
  },
});

export type PgSql = typeof sql;
