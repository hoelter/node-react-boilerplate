import { Shell } from "@client/components/Shell";
import { queryClient } from "@client/utils/queryClient";
import { trpc } from "@client/utils/trpc";
import { createTheme, MantineProvider } from "@mantine/core";
import { QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";

const theme = createTheme({
  /** Put your mantine theme override here */
});

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/trpc",
    }),
  ],
});

export function App() {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <MantineProvider theme={theme}>
          <Shell />
        </MantineProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
