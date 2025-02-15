import { Container, Space, Text, Title } from "@mantine/core";

export function FourOhFour() {
  return (
    <Container pt="sm">
      <Title order={2}>404 Not Found</Title>
      <Space h="md" />
      <Text>The resource was not found. Please go back or click Home.</Text>
    </Container>
  );
}
