import { JSX } from 'solid-js';
import { NumberFormatter } from './NumberFormatter';
import { MantineProvider } from '../../core';

export default {
  title: 'NumberFormatter',
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
      <NumberFormatter
        value={-1022233.34}
        decimalScale={3}
        decimalSeparator="dec"
        fixedDecimalScale
        thousandSeparator
        prefix="$ "
        suffix=" R$"
        class="test"
      />
    </div>
  );
}
