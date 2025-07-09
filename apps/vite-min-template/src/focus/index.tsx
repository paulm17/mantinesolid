import { createEffect, onCleanup, type Component, type JSX, splitProps } from 'solid-js';

export const MinimalFocusTrap: Component<{ active: boolean; children: JSX.Element }> = (
  props
) => {
  let trapRef: HTMLDivElement | undefined;
  const [local] = splitProps(props, ['active', 'children']);

  createEffect(() => {
    console.log('[MinimalTrap] Effect triggered. Is active?', local.active);
    const element = trapRef;

    if (!local.active || !element) {
      return;
    }

    console.log('[MinimalTrap] Trap is now ACTIVE on element:', element);

    // Auto-focus logic
    const focusable = element.querySelector<HTMLElement>(
      'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
    );

    if (focusable) {
      console.log('[MinimalTrap] Found focusable element:', focusable);
      // A timeout is still a good practice here to prevent race conditions
      setTimeout(() => focusable.focus(), 0);
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        // This is a simplified tab trapping logic for demonstration
        const focusableElements = Array.from(
          element.querySelectorAll<HTMLElement>(
            'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => !el.hasAttribute('disabled'));

        if (focusableElements.length === 0) {
          event.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            event.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            event.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    onCleanup(() => {
      document.removeEventListener('keydown', handleKeyDown);
      console.log('[MinimalTrap] Cleaned up effect.');
    });
  });

  // The ref is applied directly here
  return <div ref={trapRef}>{local.children}</div>;
};
