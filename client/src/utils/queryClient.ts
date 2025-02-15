import { routes } from "@client/clientConstants";
import { isTRPCClientError } from "@client/utils/trpc";
import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { navigate } from "wouter/use-browser-location";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
  queryCache: new QueryCache({
    onError: (e) => {
      if (isTRPCClientError(e)) {
        if (e.data?.httpStatus === 401 && window.location.pathname !== routes.signIn) {
          navigate(routes.toSignIn(window.location.pathname));
        }
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (e) => {
      if (isTRPCClientError(e)) {
        if (e.data?.httpStatus === 401 && window.location.pathname !== routes.signIn) {
          navigate(routes.toSignIn(window.location.pathname));
        }
      }
    },
  }),
});
