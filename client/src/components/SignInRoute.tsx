import { routes } from "@client/clientConstants";
import { trpc } from "@client/utils/trpc";
import { Alert, Button, Container, Group, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { LoginRequest, loginRequestSchema } from "@shared/types";
import { useMutation } from "@tanstack/react-query";
import { valibotResolver } from "mantine-form-valibot-resolver";
import { useLocation, useSearch } from "wouter";

export function SignInRoute() {
  const searchString = useSearch();
  const [_, setLocation] = useLocation();

  const login = useMutation(
    trpc.login.mutationOptions({
      onSuccess() {
        const returnUrl = new URLSearchParams(searchString).get("returnUrl");
        setLocation(returnUrl || routes.root);
      },
    }),
  );

  const form = useForm<LoginRequest>({
    initialValues: {
      username: "",
      password: "",
    },
    validate: valibotResolver(loginRequestSchema),
  });

  const onSubmit = form.onSubmit((values) => {
    login.mutate(values);
  });

  return (
    <Container pt="sm">
      <Title order={2}>Sign In</Title>
      {login.isError ? <Alert color="red">{login.error.message}</Alert> : null}
      <form onSubmit={onSubmit}>
        <TextInput mt="md" size="md" label={"Username"} {...form.getInputProps("username")} />
        <TextInput mt="md" size="md" label={"Password"} type="password" {...form.getInputProps("password")} />

        <Group mt="md" justify="flex-end">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Container>
  );
}
