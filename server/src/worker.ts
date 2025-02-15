import { initQueues, initWorkers, shutdownPgBoss } from "@server/services/queueService";
import { logger } from "@server/utils/logger";

async function startWorker() {
  try {
    await initQueues();
    await initWorkers();

    async function handleExit(signalName: string) {
      logger.info(`${signalName} signal received: shutting down worker`);

      await shutdownPgBoss();

      logger.info("Worker shutdown");
      process.exit(0);
    }

    process.on("SIGTERM", () => handleExit("SIGTERM"));
    process.on("SIGINT", () => handleExit("SIGINT"));
  } catch (e) {
    logger.error("Failed to start app", e);
    process.exit(1);
  }
}

startWorker();