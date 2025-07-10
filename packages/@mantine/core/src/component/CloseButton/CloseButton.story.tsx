import { JSX } from 'solid-js';
import { CloseButton } from './CloseButton';
import { MantineProvider } from '../../core';

export default {
  title: 'CloseButton',
  decorators: [
    (Story: () => JSX.Element) => (
      <MantineProvider>
        <Story />
      </MantineProvider>
    ),
  ],
};

export function SingleButton() {
  return (
    <div style={{ padding: '40px' }}>
      <CloseButton />
    </div>
  );
}

export function Disabled() {
  return (
    <div style={{ padding: '40px' }}>
      <CloseButton disabled />
    </div>
  );
}

export function Usage() {
  return (
    <div style={{ padding: '40px' }}>
      <CloseButton size="xs" />
      <CloseButton size="sm" />
      <CloseButton size="md" />
      <CloseButton size="lg" />
      <CloseButton size="xl" />
      <CloseButton size="10rem" iconSize="8rem" />
      <CloseButton unstyled />
    </div>
  );
}
