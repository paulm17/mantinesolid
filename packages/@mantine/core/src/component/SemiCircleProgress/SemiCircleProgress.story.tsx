import { SemiCircleProgress } from './SemiCircleProgress';

export default { title: 'SemiCircleProgress' };

export function Usage() {
  return (
    <div style={{ 'padding': '40px' }}>
      <SemiCircleProgress value={40} label="40%" labelPosition="bottom" />
    </div>
  );
}
