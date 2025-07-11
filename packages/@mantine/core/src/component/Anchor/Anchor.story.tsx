import { JSX } from 'solid-js';
import { Anchor } from './Anchor';
import { MantineProvider } from '../../core';

export default {
  title: 'Anchor',
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
      <Anchor href="https://mantine.dev" target="blank" underline="never">
        Mantine website link: never
      </Anchor>
      <br />
      <Anchor href="https://mantine.dev" target="blank">
        Mantine website link: hover
      </Anchor>
      <br />
      <Anchor href="https://mantine.dev" target="blank" underline="not-hover">
        Mantine website link: not hover
      </Anchor>
      <br />
      <Anchor href="https://mantine.dev" target="blank" underline="always">
        Mantine website link: always
      </Anchor>
      <br />
      <Anchor
        href="https://mantine.dev"
        target="blank"
        underline="never"
        variant="gradient"
        fz={60}
        fw="bold"
      >
        Mantine website link: never
      </Anchor>
    </div>
  );
}

export function Unstyled() {
  return (
    <Anchor href="#" unstyled>
      Unstyled
    </Anchor>
  );
}

export function LineClamp() {
  return (
    <Anchor href="#" lineClamp={1}>
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Totam non ipsum aliquid
      voluptatibus. Repellat, illo cumque a inventore excepturi dolorem? Asperiores quasi numquam
      natus ipsum rerum architecto cumque quo ut.
    </Anchor>
  );
}
