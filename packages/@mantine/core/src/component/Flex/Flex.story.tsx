import { JSX } from 'solid-js';
import { Button } from '../Button';
import { Flex } from './Flex';
import { MantineProvider } from '../../core';

export default {
  title: 'Flex',
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
      <Flex>
        <Button>First</Button>
        <Button>Second</Button>
      </Flex>
    </div>
  );
}
