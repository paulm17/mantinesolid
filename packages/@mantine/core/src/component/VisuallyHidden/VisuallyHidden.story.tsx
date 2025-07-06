import { JSX } from 'solid-js/jsx-runtime';
import { ActionIcon } from '../ActionIcon';
import { VisuallyHidden } from './VisuallyHidden';
import { MantineProvider } from '../../core';

export default {
  title: 'VisuallyHidden',
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
      <ActionIcon>
        <VisuallyHidden>Pronounce this</VisuallyHidden>
        $$
      </ActionIcon>
    </div>
  );
}
