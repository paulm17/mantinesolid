import { JSX } from 'solid-js';
import { Divider } from './Divider';
import { MantineProvider } from '../../core';

export default {
  title: 'Divider',
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
      <div>First</div>
      <Divider label="Divider label" labelPosition="right" />
      <div>Second</div>
    </div>
  );
}
