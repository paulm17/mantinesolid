import { CloseButton } from './CloseButton';

export default { title: 'CloseButton' };

export function SingleButton() {
  return (
    <div style={{ padding: '40px' }}>
      <CloseButton />
    </div>
  );
}

export function Disabled() {
  return (
    <div style={{ padding: '40px' }}>
      <CloseButton disabled />
    </div>
  );
}

export function Usage() {
  return (
    <div style={{ padding: '40px' }}>
      <CloseButton size="xs" />
      <CloseButton size="sm" />
      <CloseButton size="md" />
      <CloseButton size="lg" />
      <CloseButton size="xl" />
      <CloseButton size="10rem" iconSize="8rem" />
      <CloseButton unstyled />
    </div>
  );
}
