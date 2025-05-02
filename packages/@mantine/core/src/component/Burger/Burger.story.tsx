import { createSignal } from 'solid-js';
import { Burger } from './Burger';

export default { title: 'Burger' };

export function Usage() {
  const [opened, setOpened] = createSignal(false);
  return (
    <div style={{ 'padding': '40px' }}>
      <Burger opened={opened()} onClick={() => setOpened((o) => !o)} size={400} lineSize={1} />
    </div>
  );
}

export function Unstyled() {
  const [opened, setOpened] = createSignal(false);
  return (
    <div style={{ 'padding': '40px' }}>
      <Burger opened={opened()} onClick={() => setOpened((o) => !o)} unstyled />
    </div>
  );
}
