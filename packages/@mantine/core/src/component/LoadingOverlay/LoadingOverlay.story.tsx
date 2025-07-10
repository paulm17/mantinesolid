import { JSX } from 'solid-js';
import { LoadingOverlay } from './LoadingOverlay';
import { MantineProvider } from '../../core';

export default {
  title: 'LoadingOverlay',
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
      <LoadingOverlay visible />
    </div>
  );
}

export function CustomLoader() {
  return (
    <div style={{ 'padding': '40px' }}>
      <LoadingOverlay
        visible
        loaderProps={{
          children: 'Loading...',
        }}
      />
    </div>
  );
}

export function Unstyled() {
  return (
    <div style={{ 'padding': '40px' }}>
      <LoadingOverlay visible unstyled />
    </div>
  );
}
