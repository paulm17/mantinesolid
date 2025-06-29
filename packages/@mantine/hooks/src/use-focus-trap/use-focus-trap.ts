import { createEffect, createSignal, onCleanup, Accessor } from 'solid-js';
import { scopeTab } from './scope-tab';

export function useFocusTrap(activeAccessor: Accessor<boolean> | boolean = true): (instance: HTMLElement | null) => void {
  const [ref, setRef] = createSignal<HTMLElement | null>(null);
  const active = typeof activeAccessor === 'function' ? activeAccessor : () => activeAccessor;

  const setRefCallback = (node: HTMLElement | null) => {
    if (ref() === node) {
      return;
    }
    setRef(node);
  };

  createEffect(() => {
    if (!active() || !ref()) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab' && ref()) {
        scopeTab(ref() as HTMLElement, event);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    onCleanup(() => {
      document.removeEventListener('keydown', handleKeyDown);
    });
  });

  return setRefCallback;
}
