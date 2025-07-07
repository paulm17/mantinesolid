import { JSX } from 'solid-js';
import type { Preview } from 'storybook-solidjs-vite';
import { MantineProvider } from '@mantine/core';

const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    // automatically create action args for all props that start with "on"
    actions: { argTypesRegex: '^on.*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    (Story: () => JSX.Element) => (
      <MantineProvider>
        <Story />
      </MantineProvider>
    ),
  ]
};

export default preview;
