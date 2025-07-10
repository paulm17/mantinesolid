import { useDisclosure } from '@mantine/hooks';
import { FocusTrap } from './FocusTrap';
import { JSX } from 'solid-js';
import { MantineProvider } from '../../core';

export default {
  title: 'FocusTrap',
  decorators: [
    (Story: () => JSX.Element) => (
      <MantineProvider>
        <Story />
      </MantineProvider>
    ),
  ],
};

export function Usage() {
  const [active, handlers] = useDisclosure(false);
  return (
    <>
      <button type="button" onClick={handlers.toggle}>
        Toggle
      </button>
      <FocusTrap active={active()}>
        {(focusTrapProps) => (
          <div {...focusTrapProps}>
            <input />
            <input />
            <input />
          </div>
        )}
      </FocusTrap>
    </>
  );
}
