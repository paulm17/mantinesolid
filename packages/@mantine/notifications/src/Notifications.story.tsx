import { JSX } from 'solid-js';
import { Button, Group, MantineProvider } from '@mantine/core';
import { showNotification } from './notifications.store';

export default {
  title: 'Notifications',
  decorators: [
    (Story: () => JSX.Element) => (
      <MantineProvider>
        <Story />
      </MantineProvider>
    ),
  ]
};

export function Usage() {
  return (
    <div style={{ padding: '40px' }}>
      <Group>
        <Button
          onClick={() =>
            showNotification({ message: 'Test', title: 'Test', position: 'bottom-right' })
          }
        >
          bottom-right
        </Button>
        <Button
          onClick={() =>
            showNotification({ message: 'Test', title: 'Test', position: 'bottom-left' })
          }
        >
          bottom-left
        </Button>
        <Button
          onClick={() => showNotification({ message: 'Test', title: 'Test', position: 'top-left' })}
        >
          top-left
        </Button>
        <Button
          onClick={() =>
            showNotification({ message: 'Test', title: 'Test', position: 'top-right' })
          }
        >
          top-right
        </Button>
      </Group>
    </div>
  );
}
