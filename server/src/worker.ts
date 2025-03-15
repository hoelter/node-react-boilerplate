import { initQueues, initWorkers, shutdownPgBoss } from "@server/services/queueService";
import { logger } from "@server/utils/logger";
import closeWithGrace from "close-with-grace";

async function startWorker() {
  try {
    await initQueues();
    await initWorkers();

    async function handleExit(signalName: string | undefined) {
      logger.info(`${signalName || "unknown"} signal received: shutting down worker`);

      await shutdownPgBoss();

      logger.info("Worker shutdown");
      process.exit(0);
    }

    closeWithGrace(async ({ signal, err }) => {
      if (err) {
        logger.error("worker closingWithGraceError", err);
      }
      await handleExit(signal);
    });
  } catch (e) {
    logger.error("Failed to start worker", e);
    process.exit(1);
  }
}

startWorker();
