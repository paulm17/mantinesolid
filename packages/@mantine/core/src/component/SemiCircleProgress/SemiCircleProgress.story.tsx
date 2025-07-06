import { JSX } from 'solid-js/jsx-runtime';
import { SemiCircleProgress } from './SemiCircleProgress';
import { MantineProvider } from '../../core';

export default {
  title: 'SemiCircleProgress',
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
      <SemiCircleProgress value={40} label="40%" labelPosition="bottom" />
    </div>
  );
}
