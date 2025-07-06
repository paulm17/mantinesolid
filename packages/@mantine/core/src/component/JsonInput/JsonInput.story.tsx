import { createSignal, JSX } from 'solid-js';
import { JsonInput } from './JsonInput';
import { MantineProvider } from '../../core';

export default {
  title: 'JsonInput',
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
    <>
      <JsonInput defaultValue='{ "a": 1, "B": 2 }' label="Usage" placeholder="Usage" formatOnBlur />
      <JsonInput defaultValue='{ "a": 1, "B": 2 }' label="Usage" placeholder="Usage" size="sm" />
    </>
  );
}

export function ReadOnly() {
  return (
    <JsonInput
      defaultValue='{ "a": 1, "B": 2 }'
      label="Controlled"
      placeholder="Controlled"
      formatOnBlur
      readOnly
    />
  );
}

export function Controlled() {
  const [value, onChange] = createSignal('');
  return (
    <JsonInput
      value={value()}
      onChange={onChange}
      label="Controlled"
      placeholder="Controlled"
      formatOnBlur
    />
  );
}

export function Unstyled() {
  return (
    <JsonInput
      defaultValue='{ "a": 1, "B": 2 }'
      label="Controlled"
      placeholder="Controlled"
      formatOnBlur
      unstyled
    />
  );
}
