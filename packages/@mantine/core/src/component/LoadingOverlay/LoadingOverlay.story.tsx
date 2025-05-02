import { LoadingOverlay } from './LoadingOverlay';

export default { title: 'LoadingOverlay' };

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
