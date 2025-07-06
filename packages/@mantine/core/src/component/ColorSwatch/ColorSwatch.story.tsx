import { JSX } from 'solid-js/jsx-runtime';
import { ColorSwatch } from './ColorSwatch';
import { MantineProvider } from '../../core';

export default {
  title: 'ColorSwatch',
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
      <ColorSwatch color="#ff00ff" />
      <ColorSwatch color="#ff00ff" unstyled />
      <ColorSwatch color="rgba(0, 56, 13, 0.2)" />
      <ColorSwatch color="rgba(0, 56, 13, 0.2)">$$</ColorSwatch>
      <ColorSwatch color="rgba(0, 56, 13, 0.2)" component="a" href="/">
        $$
      </ColorSwatch>
    </div>
  );
}
