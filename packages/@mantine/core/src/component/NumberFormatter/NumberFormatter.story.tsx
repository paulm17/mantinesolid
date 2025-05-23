import { NumberFormatter } from './NumberFormatter';

export default { title: 'NumberFormatter' };

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
