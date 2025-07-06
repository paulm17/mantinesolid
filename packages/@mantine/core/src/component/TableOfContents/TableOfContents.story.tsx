import { JSX } from 'solid-js/jsx-runtime';
import { TableOfContents } from './TableOfContents';
import { MantineProvider } from '../../core';

export default {
  title: 'TableOfContents',
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
    <div style={{ 'padding': '40px', 'max-width': '350px' }}>
      <TableOfContents
        size="sm"
        initialData={[
          { id: '1', value: 'Heading 1', depth: 1 },
          { id: '2', value: 'Heading 2', depth: 2 },
          { id: '3', value: 'Heading 3', depth: 3 },
        ]}
      />
    </div>
  );
}
