import { FastifyBaseLogger } from "@fastify";

declare module "@fastify/request-context" {
  export interface RequestContextData extends RequestContextData {
    logger: FastifyBaseLogger;
  }
}
