import { For } from 'solid-js';
import { CalendarHeader } from './CalendarHeader';

export default { title: 'CalendarHeader' };

export function Usage() {
  return (
    <div style={{ padding: '40px', width: '300px' }}>
      <CalendarHeader label="March 2022" />
    </div>
  );
}

export function DisabledControls() {
  return (
    <div style={{ padding: '40px', width: '300px' }}>
      <CalendarHeader label="March 2022" nextDisabled previousDisabled hasNextLevel={false} />
    </div>
  );
}

export function Unstyled() {
  return (
    <div style={{ padding: '40px', width: '300px' }}>
      <CalendarHeader label="March 2022" unstyled />
    </div>
  );
}

export function WithoutNext() {
  return (
    <div style={{ padding: '40px', width: '300px' }}>
      <CalendarHeader label="March 2022" withNext={false} />
    </div>
  );
}

export function WithoutPrevious() {
  return (
    <div style={{ padding: '40px', width: '300px' }}>
      <CalendarHeader label="March 2022" withPrevious={false} />
    </div>
  );
}

export function WithoutNextAndPrevious() {
  return (
    <div style={{ padding: '40px', width: '300px' }}>
      <CalendarHeader label="March 2022" withPrevious={false} withNext={false} />
    </div>
  );
}

export function Sizes() {
  const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

  return (
    <div style={{ padding: '40px' }}>
      <For each={sizes}>
        {(size) => (
          <CalendarHeader label="January" size={size} mt="xl" />
        )}
      </For>
    </div>
  );
}
