import { initQueues, initWorkers, shutdownPgBoss } from "@server/services/queueService";
import { createTRPCContext } from "@server/services/trpcService";
import { appRouter } from "@server/trpcRouter";
import { envVars, isProduction } from "@server/utils/envUtils";
import { logger } from "@server/utils/logger";
import { assertIsDefined } from "@shared/sharedUtils";
import * as trpcExpress from "@trpc/server/adapters/express";
import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import path from "node:path";

const hostname = "0.0.0.0";
const port = envVars.PORT;

const app = express();

app.use(helmet());

app.use(cookieParser(envVars.COOKIE_SECRET));

// This serves the client build in production mode.
app.use(express.static(path.join(__dirname, "../../client/dist")));

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: createTRPCContext,
    onError: (opts) => {
      logger.error("TRPC error", opts.error);
    },
  }),
);

// Use for heatlh check
app.get("/health-alive", (_, res) => {
  res.send("alive");
});

// example additional express endpoint outside of trpc
app.get("/api/hi-express", (_, res) => res.send("hello world api"));

app.get("*", (_, res) => {
  // Redirect anything else to the react app.
  logger.debug("catch all route hit");
  res.sendFile(path.join(__dirname, "../../client/dist", "index.html"));
});

async function start() {
  assertIsDefined(port, "Port not defined during startup");

  try {
    await initQueues();

    if (!isProduction) {
      // Run workers in the same process as the express server during development.
      // In production, it is expected to run the worker.ts file as a separate node process.
      await initWorkers();
    }

    const server = app.listen(port, hostname, () => {
      logger.info(`Express server started on port: ${port} at hostname: ${hostname}`);
    });

    async function handleExit(signalName: string) {
      logger.info(`${signalName} signal received: closing HTTP server`);
      server.close(async () => {
        logger.info("HTTP server closed");
        await shutdownPgBoss();
        logger.info("Queue shutdown");
        process.exit(0);
      });
    }

    process.on("SIGTERM", () => handleExit("SIGTERM"));
    process.on("SIGINT", () => handleExit("SIGINT"));
  } catch (e) {
    logger.error("Failed to start app", e);
    process.exit(1);
  }
}

start();
