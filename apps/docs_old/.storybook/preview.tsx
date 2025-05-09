import type { Preview } from 'storybook-solidjs';
import { MantineProvider } from "@mantine/core";
// import { theme } from './theme';

const preview: Preview = {
  decorators: [
    (renderStory) => (
      <MantineProvider theme={{}}>
        {renderStory()}
      </MantineProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
