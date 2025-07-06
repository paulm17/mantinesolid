import { JSX } from 'solid-js/jsx-runtime';
import { TextInput } from '../TextInput';
import { Fieldset } from './Fieldset';
import { MantineProvider } from '../../core';

export default {
  title: 'Fieldset',
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
    <div style={{ 'padding': '40px', 'max-width': '500px' }}>
      <Fieldset legend="Unstyled fieldset" variant="unstyled" disabled>
        <TextInput label="Name" placeholder="Name" />
        <TextInput label="Email" placeholder="Email" mt="md" />
      </Fieldset>

      <Fieldset legend="Default fieldset" variant="default" mt="xl">
        <TextInput label="Name" placeholder="Name" />
        <TextInput label="Email" placeholder="Email" mt="md" />
      </Fieldset>

      <Fieldset legend="Filled fieldset" variant="filled" mt="xl" radius="md">
        <TextInput label="Name" placeholder="Name" />
        <TextInput label="Email" placeholder="Email" mt="md" />
      </Fieldset>
    </div>
  );
}
