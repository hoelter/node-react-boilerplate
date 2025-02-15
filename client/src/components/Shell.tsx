import { routes } from "@client/clientConstants";
import { AppRoutes } from "@client/components/AppRoutes";
import { queryClient } from "@client/utils/queryClient";
import { trpc } from "@client/utils/trpc";
import { Anchor, AppShell, Burger, Divider, Group, useMantineTheme } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { useEffect } from "react";
import { Link, useLocation } from "wouter";

export function Shell() {
  const [location, setLocation] = useLocation();
  const theme = useMantineTheme();
  const [burgerOpened, { toggle: toggleBurger, close }] = useDisclosure();
  const isDesktopWidth = useMediaQuery(`(min-width: ${theme.breakpoints.sm})`);

  const logout = trpc.logout.useMutation({
    onSuccess() {
      setLocation(routes.signIn);
      queryClient.clear();
    },
  });

  const isSignInPage = location === routes.signIn;

  useEffect(() => {
    if (isDesktopWidth && burgerOpened) {
      close();
    }
  }, [isDesktopWidth]);

  return (
    <AppShell
      header={{ height: 50 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { desktop: true, mobile: !burgerOpened } }}
    >
      <AppShell.Header>
        <Group h="100%" p="xs" justify="space-between" style={{ flex: 1 }}>
          <Anchor c="black" href={routes.root} component={Link} underline="never">
            NodeReactBoilerplate
          </Anchor>
          {isSignInPage ? null : (
            <>
              <Group visibleFrom="sm">
                <Anchor
                  c={location === routes.helloWorld ? "gray.9" : "gray.6"}
                  href={routes.helloWorld}
                  component={Link}
                >
                  Hello World
                </Anchor>
                <Divider orientation="vertical" />
                <Anchor c="gray.7" onClick={() => logout.mutate()}>
                  Sign Out
                </Anchor>
              </Group>
              <Burger opened={burgerOpened} onClick={toggleBurger} hiddenFrom="sm" size="sm" />
            </>
          )}
        </Group>
      </AppShell.Header>

      <AppShell.Navbar px={4}>
        {isSignInPage ? null : (
          <>
            <Anchor
              c={location === routes.helloWorld ? "gray.9" : "gray.6"}
              href={routes.helloWorld}
              onClick={close}
              component={Link}
              mt="md"
            >
              Hello World
            </Anchor>
            <Divider my="sm" />
            <Anchor c={"gray.7"} onClick={() => logout.mutate()}>
              Sign Out
            </Anchor>
          </>
        )}
      </AppShell.Navbar>

      <AppShell.Main>
        <AppRoutes />
      </AppShell.Main>
    </AppShell>
  );
}
