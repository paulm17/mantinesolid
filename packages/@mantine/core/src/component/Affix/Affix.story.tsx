import { JSX } from 'solid-js';
import { Box, MantineProvider } from '../../core';
import { Affix } from './Affix';

export default {
  title: 'Affix',
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
      <Affix position={{ bottom: 'xl', right: 90 }}>
        <Box bg="blue" p="xl">
          Affix box
        </Box>
      </Affix>
    </div>
  );
}
