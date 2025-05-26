import { Card, Group, Image, SimpleGrid, Text } from '@mantine/core';
import { For } from 'solid-js';

const images = [
  'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-1.png',
  'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-2.png',
  'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-3.png',
];

export default function Card4() {
  return (
    <div style={{
      'margin-left': 'auto',
      'margin-right': 'auto',
      'margin-bottom': '10px',
      'width': '500px',
    }}>
      <Card withBorder shadow="sm" radius="md">
        <Card.Section withBorder inheritPadding py="xs">
          <Group justify="space-between">
            <Text fw={500}>Review pictures</Text>
            Menu
          </Group>
        </Card.Section>

        <Text mt="sm" c="dimmed" size="sm">
          <Text span inherit c="var(--mantine-color-anchor)">
            200+ images uploaded
          </Text>{' '}
          since last visit, review them to select which one should be added to your gallery
        </Text>

        <Card.Section mt="sm">
          <Image src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-4.png" />
        </Card.Section>

        <Card.Section inheritPadding mt="sm" pb="md">
          <SimpleGrid cols={3}>
            <For each={images}>
              {(image) => (
                <Image src={image} />
              )}
            </For>
          </SimpleGrid>
        </Card.Section>
      </Card>
    </div>
  );
}
