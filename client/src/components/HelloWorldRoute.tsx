import { trpc } from "@client/utils/trpc";
import { Container, Text, Title } from "@mantine/core";

export function HelloWorldRoute() {
  const { data: helloWorldText } = trpc.getHelloWorld.useQuery();

  return (
    <Container pt="sm">
      <Title mb="md" order={2}>Hello</Title>
      {helloWorldText ? <Text>{helloWorldText}</Text> : null}
    </Container>
  );
}
