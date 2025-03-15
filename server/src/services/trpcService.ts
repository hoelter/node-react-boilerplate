import { parseAuthCookie } from "@server/services/authService";
import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";

export function createTRPCContext({ req, res }: CreateFastifyContextOptions) {
  const authContext = parseAuthCookie(req);
  return {
    req,
    res,
    authContext,
  };
}

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;
