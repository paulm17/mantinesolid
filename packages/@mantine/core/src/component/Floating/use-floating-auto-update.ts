import { createSignal, createEffect, onCleanup, on } from 'solid-js';
import { autoUpdate } from 'floating-ui-solid';

interface Payload {
  opened: () => boolean;
  floating: {
    update: () => void;
    refs: {
      reference: () => Element | undefined;
      floating: () => Element | undefined;
    };
  };
  position: any;
  positionDependencies: any[];
}

export function useFloatingAutoUpdate({
  opened,
  floating,
  position,
  positionDependencies,
}: Payload) {
  const [delayedUpdate, setDelayedUpdate] = createSignal(0);
  let cleanupAuto: (() => void) | undefined;

  createEffect(() => {
    delayedUpdate();

    const isOpen = opened();
    const refEl = floating.refs.reference();
    const floatEl = floating.refs.floating();

    cleanupAuto?.();

    if (
      isOpen &&
      refEl instanceof HTMLElement &&
      floatEl instanceof HTMLElement
    ) {
      cleanupAuto = autoUpdate(
        refEl,
        floatEl,
        floating.update
      );
    }

    onCleanup(() => cleanupAuto?.());
  });

  createEffect(
    on(
      () => positionDependencies,
      () => {
        floating.update();
      }
    )
  );

  createEffect(
    on(
      () => opened(),
      () => setDelayedUpdate(c => c + 1),
      { defer: true }
    )
  );
}
