import { createSignal, JSX } from 'solid-js';
import { Burger } from './Burger';
import { MantineProvider } from '../../core';

export default {
  title: 'Burger',
  decorators: [
    (Story: () => JSX.Element) => (
      <MantineProvider>
        <Story />
      </MantineProvider>
    ),
  ],
};

export function Usage() {
  const [opened, setOpened] = createSignal(false);
  return (
    <div style={{ 'padding': '40px' }}>
      <Burger opened={opened()} onClick={() => setOpened((o) => !o)} size={400} lineSize={1} />
    </div>
  );
}

export function Unstyled() {
  const [opened, setOpened] = createSignal(false);
  return (
    <div style={{ 'padding': '40px' }}>
      <Burger opened={opened()} onClick={() => setOpened((o) => !o)} unstyled />
    </div>
  );
}
