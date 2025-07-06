import { JSX } from 'solid-js/jsx-runtime';
import { BackgroundImage } from './BackgroundImage';
import { MantineProvider } from '../../core';

export default {
  title: 'BackgroundImage',
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
      <BackgroundImage
        w={400}
        h={200}
        src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
      >
        Content
      </BackgroundImage>
    </div>
  );
}

export function Unstyled() {
  return (
    <div style={{ 'padding': '40px' }}>
      <BackgroundImage
        w={400}
        h={200}
        radius="md"
        src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
        unstyled
      >
        Content
      </BackgroundImage>
    </div>
  );
}
