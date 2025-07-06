import { JSX } from 'solid-js/jsx-runtime';
import { Stack } from './Stack';
import { MantineProvider } from '../../core';

export default {
  title: 'Stack',
  decorators: [
    (Story: () => JSX.Element) => (
      <MantineProvider>
        <Story />
      </MantineProvider>
    ),
  ],
};

export function Usage() {
  return (
    <div style={{ 'padding': '40px' }}>
      <Stack>
        <button type="button">First</button>
        <button type="button">Second</button>
        <button type="button">Third</button>
      </Stack>
    </div>
  );
}
