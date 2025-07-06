import { useState } from 'react';
import { FileInput } from './FileInput';
import { JSX } from 'solid-js/jsx-runtime';
import { MantineProvider } from '../../core';

export default {
  title: 'FileInput',
  decorators: [
    (Story: () => JSX.Element) => (
      <MantineProvider>
        <Story />
      </MantineProvider>
    ),
  ],
};

export function Usage() {
  const [value, setValue] = useState<File | null>(null);
  return (
    <div style={{ 'padding': '40px' }}>
      <FileInput placeholder="Pick file" value={value} onChange={setValue} />
    </div>
  );
}

export function Unstyled() {
  const [value, setValue] = useState<File | null>(null);
  return (
    <div style={{ 'padding': '40px' }}>
      <FileInput placeholder="Pick file" value={value} onChange={setValue} unstyled />
    </div>
  );
}

export function Multiple() {
  const [value, setValue] = useState<File[]>([]);
  return (
    <div style={{ 'padding': '40px' }}>
      <FileInput placeholder="Multiple" multiple value={value} onChange={setValue} clearable />
    </div>
  );
}
