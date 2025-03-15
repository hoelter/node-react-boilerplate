import { queryClient } from "@client/utils/queryClient";
import { trpcClient } from "@client/utils/trpcClient";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import type { AppRouter } from "../../../server/src/trpcRouter"; // Necessary hard link to type server side -- should be the only one

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient: queryClient,
});
