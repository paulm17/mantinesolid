import { JSX } from 'solid-js';
import { Button, Group, MantineProvider } from '@mantine/core';
import { NavigationProgress } from './NavigationProgress';
import { nprogress } from './nprogress.store';

export default {
  title: 'NavigationProgress',
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
      <NavigationProgress />
      <Group>
        <Button onClick={nprogress.start}>Start</Button>
        <Button onClick={nprogress.stop}>Stop</Button>
        <Button onClick={() => nprogress.set(95)}>Set 95</Button>
        <Button onClick={nprogress.increment}>Increment</Button>
        <Button onClick={nprogress.decrement}>Decrement</Button>
        <Button onClick={nprogress.complete}>Complete</Button>
      </Group>
    </div>
  );
}
