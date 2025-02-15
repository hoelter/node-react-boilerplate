import { parseAuthCookie } from "@server/services/authService";
import * as trpcExpress from "@trpc/server/adapters/express";

export function createTRPCContext({ req, res }: trpcExpress.CreateExpressContextOptions) {
  const authContext = parseAuthCookie(req);
  return {
    req,
    res,
    authContext,
  };
}

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;
