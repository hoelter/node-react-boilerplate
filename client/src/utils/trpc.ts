import { createTRPCReact } from "@trpc/react-query";
import { TRPCClientError } from "@trpc/client";
import type { AppRouter } from "../../../server/src/trpcRouter"; // Necessary hard link to type server side -- should be the only one

export const trpc = createTRPCReact<AppRouter>();

export function isTRPCClientError(cause: unknown): cause is TRPCClientError<AppRouter> {
  return cause instanceof TRPCClientError;
}
