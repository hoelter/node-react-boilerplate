import { trpc } from "@client/utils/trpc";
import { Container, Text, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";

export function HelloWorldRoute() {
  const { data: helloWorldText } = useQuery(trpc.getHelloWorld.queryOptions());

  return (
    <Container pt="sm">
      <Title mb="md" order={2}>
        Hello
      </Title>
      {helloWorldText ? <Text>{helloWorldText}</Text> : null}
    </Container>
  );
}
