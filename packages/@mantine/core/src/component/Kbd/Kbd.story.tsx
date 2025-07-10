import { JSX } from 'solid-js';
import { Kbd } from './Kbd';
import { MantineProvider } from '../../core';

export default {
  title: 'Kbd',
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
      <Kbd size={30}>Shift</Kbd>
    </div>
  );
}
