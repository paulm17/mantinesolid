import { JSX } from 'solid-js/jsx-runtime';
import { Skeleton } from './Skeleton';
import { MantineProvider } from '../../core';

export default {
  title: 'Skeleton',
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
      <Skeleton height={"200px"} />
    </div>
  );
}

export function Circle() {
  return (
    <div style={{ 'padding': '40px' }}>
      <Skeleton height={"200px"} circle />
    </div>
  );
}
