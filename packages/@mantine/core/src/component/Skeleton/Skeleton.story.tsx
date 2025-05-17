import { Skeleton } from './Skeleton';

export default { title: 'Skeleton' };

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
