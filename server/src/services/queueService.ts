import { pgBoss } from "@server/queueClient";
import { doSomethingQueue, initDoSomethingQueue } from "@server/queues/doSomethingQueue";
import { logger } from "@server/utils/logger";

export async function shutdownPgBoss() {
  await pgBoss.stop({ graceful: true });
  logger.info("pgboss gracefully stopped");
}

// This will migrate the postgres db server creating a new "pgboss" schema and tables the first time it's ran
export async function initQueues() {
  const onError = (error: Error) => {
    logger.error("pg-boss error", error);
  };

  pgBoss.on("error", onError);

  await pgBoss.start();

  logger.info("pgboss initialized");

  await pgBoss.createQueue(doSomethingQueue);

  logger.info("pgboss queues created");
}

export async function initWorkers() {
  await initDoSomethingQueue();

  logger.info("pgboss workers initialized -- jobs will process");
}

