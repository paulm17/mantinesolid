import { JSX } from 'solid-js/jsx-runtime';
import { CopyButton } from './CopyButton';
import { MantineProvider } from '../../core';

export default {
  title: 'CopyButton',
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
    <CopyButton value="mantine.dev" timeout={1000}>
      {({ copied, copy }) => (
        <button type="button" style={{ color: copied ? 'teal' : 'blue' }} onClick={copy}>
          {copied ? 'Copied to clipboard' : 'Copy to clipboard'}
        </button>
      )}
    </CopyButton>
  );
}
