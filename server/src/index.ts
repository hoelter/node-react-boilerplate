import cookieFastify from "@fastify/cookie";
import helmetFastify from "@fastify/helmet";
import { sql } from "@server/dbClient";
import { fastifyRequestContext, requestContext } from "@fastify/request-context";
import staticFastify from "@fastify/static";
import { fastifyTRPCPlugin, FastifyTRPCPluginOptions } from "@trpc/server/adapters/fastify";
import closeWithGrace from "close-with-grace";
import { initQueues, initWorkers, shutdownPgBoss } from "@server/services/queueService";
import { createTRPCContext } from "@server/services/trpcService";
import { AppRouter, appRouter } from "@server/trpcRouter";
import { envVars, isProduction } from "@server/utils/envUtils";
import { assertIsDefined } from "@shared/sharedUtils";
import Fastify from "fastify";
import path from "node:path";
import { logger, pinoLogger, initFastifyLogger } from "@server/utils/logger";

const fastify = Fastify({
  loggerInstance: pinoLogger,
});

initFastifyLogger(fastify.log);

fastify.register(fastifyRequestContext);
fastify.addHook("onRequest", (request, _, done) => {
  requestContext.set("logger", request.log);
  done();
});

fastify.register(helmetFastify, {
  contentSecurityPolicy: {
    directives: {
      "img-src": ["'self'", "data:", "https:"],
    },
  },
});

fastify.register(cookieFastify, {
  secret: envVars.COOKIE_SECRET,
});

fastify.register(fastifyTRPCPlugin, {
  prefix: "/trpc",
  trpcOptions: {
    router: appRouter,
    createContext: createTRPCContext,
    onError: (opts) => {
      logger.error("TRPC error", opts.error);
    },
  } satisfies FastifyTRPCPluginOptions<AppRouter>["trpcOptions"],
});

fastify.get("/health-alive", (_, res) => {
  logger.debug("HEALTH ALIVE");
  res.send("alive");
});

fastify.register(staticFastify, {
  root: path.join(__dirname, "../../client/dist"),
});

fastify.setNotFoundHandler((_, reply) => {
  reply.sendFile("index.html");
});

async function start() {
  const host = "0.0.0.0";
  const port = envVars.PORT;
  assertIsDefined(port, "Port not defined during startup");

  try {
    await initQueues();

    if (!isProduction) {
      await initWorkers();
    }

    const handleExit = async () => {
      await fastify.close();
      await shutdownPgBoss();

      logger.info("Db closing");
      await sql.end();
      logger.info("Db closed");
    };

    closeWithGrace(async ({ signal, err }) => {
      if (err) {
        logger.error("server closing due to an error", err);
      }
      logger.info(`${signal || "unknown"} signal received: gracefullyclosing HTTP server`);
      await handleExit();
    });

    fastify.listen({ port, host }, (err, address) => {
      if (err) {
        logger.error("Failed to start HTTP server");
        throw err;
      }
      logger.info(`Http server started on port: ${port} at host: ${host}, address: ${address}`);
    });
  } catch (e) {
    logger.error("Failed to start app", e);
    process.exit(1);
  }
}

start();
