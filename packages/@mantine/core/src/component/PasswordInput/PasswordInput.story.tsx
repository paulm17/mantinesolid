import { JSX } from 'solid-js';
import { PasswordInput } from './PasswordInput';
import { MantineProvider } from '../../core';

export default {
  title: 'PasswordInput',
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
    <div data-disabled>
      <PasswordInput
        placeholder="Your password"
        label="Your password"
        error="test error"
        withErrorStyles={false}
      />
    </div>
  );
}

export function Unstyled() {
  return (
    <div style={{ 'padding': '40px', 'max-width': '340px' }}>
      <PasswordInput placeholder="Your password" description="Hello" label="There" unstyled />
    </div>
  );
}
