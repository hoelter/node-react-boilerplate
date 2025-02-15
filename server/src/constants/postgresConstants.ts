export const postgresErrorCodes = {
  // https://www.postgresql.org/docs/current/errcodes-appendix.html
  unique_violation: "23505",
} as const;

export const postgresDataTypes = {
  // https://jdbc.postgresql.org/documentation/publicapi/constant-values.html
  date: 1082,
  timestamp: 1114,
  timestamptz: 1184,
} as const;