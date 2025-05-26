import { Card, Image, Text } from "@mantine/core";

export default function Card2() {
  return (
    <div style={{ 'margin-left': 'auto', 'margin-right': 'auto', 'width': '200px' }}>
      <Card
        shadow="sm"
        padding="xl"
        component="a"
        href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        target="_blank"
      >
        <Card.Section>
          <Image
            src="https://images.unsplash.com/photo-1579227114347-15d08fc37cae?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80"
            h={160}
            alt="No way!"
          />
        </Card.Section>

        <Text fw={500} size="lg" mt="md">
          You&apos;ve won a million dollars in cash!
        </Text>

        <Text mt="xs" c="dimmed" size="sm">
          Please click anywhere on this card to claim your reward, this is not a fraud, trust us
        </Text>
      </Card>
    </div>
  );
}
