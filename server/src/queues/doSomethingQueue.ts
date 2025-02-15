import { pgBoss } from "@server/queueClient";
import { logger } from "@server/utils/logger";

export const doSomethingQueue = "do-something-queue";

export type DoSomethingMsg = {
  userId: number;
};

export async function initDoSomethingQueue() {
  await pgBoss.work<DoSomethingMsg>(doSomethingQueue, { includeMetadata: true }, async ([job]) => {
    logger.info(`${doSomethingQueue} worker processing`, { jobId: job.id });
    const isLastAttempt = job.retryCount === job.retryLimit;
    logger.info(`Last Attempt: ${isLastAttempt}`);
    logger.info(`Did work for userId ${job.data.userId}`);
  });
}

export async function queueDoSomething(msg: DoSomethingMsg) {
  await pgBoss.send(doSomethingQueue, msg);
}
