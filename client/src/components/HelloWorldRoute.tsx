import { trpc } from "@client/utils/trpc";
import { Text, Title } from "@mantine/core";

export function HelloWorldRoute() {
  const { data: helloWorldText } = trpc.getHelloWorld.useQuery();

  return (
    <div>
      <Title order={2}>Hello World</Title>
      {helloWorldText ? <Text>{helloWorldText}</Text> : null}
    </div>
  );
}
