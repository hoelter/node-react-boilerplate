import { queryClient } from "@client/utils/queryClient";
import { trpcClient } from "@client/utils/trpcClient";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import type { AppRouter } from "@client/trpcRouter";

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient: queryClient,
});
