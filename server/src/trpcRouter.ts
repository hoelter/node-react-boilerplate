import { getTRPCErrorCode, getTRPCHttpStatusCode, UnauthorizedError } from "@server/utils/errorUtils";

import { loginRequestSchema } from "@shared/types";
import { initTRPC } from "@trpc/server";
import { ZodError } from "zod";

import { TRPCContext } from "@server/services/trpcService";
import { getHelloWorld } from "@server/trpcEndpoints/getHelloWorld";
import { login } from "@server/trpcEndpoints/postLogin";
import { logout } from "@server/trpcEndpoints/postLogout";

const t = initTRPC.context<TRPCContext>().create({
  errorFormatter: ({ error, shape }) => {
    const { message, data, ...rest } = shape;
    return {
      ...rest,
      message: error.cause instanceof ZodError ? error.cause.flatten().formErrors[0] : message,
      data: {
        ...data,
        httpStatus: getTRPCHttpStatusCode(shape.data.httpStatus, error),
        code: getTRPCErrorCode(shape.data.code, error),
      },
    };
  },
});

export const publicProcedure = t.procedure;
export const protectedProcedure = publicProcedure.use(async (opts) => {
  if (!opts.ctx.authContext.isAuthenticated) {
    throw new UnauthorizedError("User is not authenticated.");
  }
  return opts.next();
});

export const appRouter = t.router({
  login: publicProcedure.input(loginRequestSchema).mutation(async (opts) => {
    return await login(opts.input, opts.ctx);
  }),
  logout: protectedProcedure.mutation(async (opts) => {
    return await logout(opts.ctx);
  }),
  getHelloWorld: protectedProcedure.query(getHelloWorld),
});

export type AppRouter = typeof appRouter;
