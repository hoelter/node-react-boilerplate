import { Shell } from "@client/components/Shell";
import { queryClient } from "@client/utils/queryClient";
import { createTheme, MantineProvider } from "@mantine/core";
import { QueryClientProvider } from "@tanstack/react-query";

const theme = createTheme({
  /** Put your mantine theme override here */
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <Shell />
      </MantineProvider>
    </QueryClientProvider>
  );
}
