import { envVars } from "@server/utils/envUtils";
import PgBoss from "pg-boss";

export const pgBoss = new PgBoss(envVars.DATABASE_URL);
