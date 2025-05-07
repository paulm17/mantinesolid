import { startTransition, useRef, useState } from 'react';
import { useWindowEvent } from '@mantine/hooks';
import { onMount } from 'solid-js';

interface UseResizingInput {
  transitionDuration: number | undefined;
  disabled: boolean | undefined;
}

export function useResizing({ transitionDuration, disabled }: UseResizingInput) {
  const [resizing, setResizing] = useState(true);
  const resizingTimeout = useRef<number>(-1);
  const disabledTimeout = useRef<number>(-1);

  useWindowEvent('resize', () => {
    setResizing(true);
    clearTimeout(resizingTimeout.current);
    resizingTimeout.current = window.setTimeout(
      () =>
        startTransition(() => {
          setResizing(false);
        }),
      200
    );
  });

  onMount(() => {
    setResizing(true);
    clearTimeout(disabledTimeout.current);
    disabledTimeout.current = window.setTimeout(
      () =>
        startTransition(() => {
          setResizing(false);
        }),
      transitionDuration || 0
    );
  });

  return resizing;
}
