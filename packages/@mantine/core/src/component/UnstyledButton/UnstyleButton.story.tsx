import { JSX } from 'solid-js/jsx-runtime';
import { MantineProvider, MantineThemeProvider } from '../../core';
import { UnstyledButton } from './UnstyledButton';

export default {
  title: 'UnstyledButton',
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
    <MantineThemeProvider
      inherit
      theme={{
        components: {
          UnstyledButton: UnstyledButton.extend({
            classNames: (_theme, props) => ({
              root: `provider-classname-${props.__staticSelector}`,
            }),
          }),
        },
      }}
    >
      <div style={{ 'padding': '40px' }}>
        <UnstyledButton styles={() => ({ root: { color: 'red' } })}>Button</UnstyledButton>
      </div>
    </MantineThemeProvider>
  );
}

export function PropsInStyles() {
  return (
    <UnstyledButton
      variant="xl"
      classNames={(_theme, props) => ({
        root: `${props.__staticSelector}----test`,
      })}
    >
      Hello
    </UnstyledButton>
  );
}
