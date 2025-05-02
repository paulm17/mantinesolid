import { createEffect, onMount, onCleanup, useContext, JSX, splitProps } from 'solid-js';
import { useDebouncedCallback, useMergedRef } from '@mantine/hooks';    // your Solid version
import { useScrollAreaContext } from '../ScrollArea.context';       // assume rewritten as Solid context
import { useScrollbarContext } from '../ScrollAreaScrollbar/Scrollbar.context';
import { addUnlinkedScrollListener, composeEventHandlers } from '../utils';

export function Thumb(props: JSX.HTMLAttributes<HTMLDivElement> & { ref?: any }) {
  const [local, others] = splitProps(props, [
    "style", "onPointerDown", "onPointerUp", "ref"
  ]);

  const scrollAreaContext = useScrollAreaContext();
  const scrollbarContext = useScrollbarContext();
  const { onThumbPositionChange, hasThumb, onThumbChange, onThumbPointerDown, onThumbPointerUp } = scrollbarContext;

  // merge forwarded ref with context’s onThumbChange
  const composedRef = useMergedRef(local.ref, (el: HTMLDivElement) => onThumbChange(el));

  // debounced cleanup of unlinked listener
  const removeListenerRef: { current?: () => void } = {};
  const debounceScrollEnd = useDebouncedCallback(() => {
    removeListenerRef.current?.();
    removeListenerRef.current = undefined;
  }, 100);

  // run once on mount: attach scroll listener
  onMount(() => {
    const viewport = scrollAreaContext.viewport;
    if (!viewport) return;

    // initial position
    onThumbPositionChange();

    const handleScroll = () => {
      debounceScrollEnd();
      if (!removeListenerRef.current) {
        removeListenerRef.current = addUnlinkedScrollListener(viewport, onThumbPositionChange);
        onThumbPositionChange();
      }
    };

    viewport.addEventListener('scroll', handleScroll);
    // cleanup
    onCleanup(() => viewport.removeEventListener('scroll', handleScroll));
  });

  return (
    <div
      data-state={hasThumb ? 'visible' : 'hidden'}
      {...others}
      ref={composedRef}
      style={{ width: 'var(--sa-thumb-width)', height: 'var(--sa-thumb-height)', ...(typeof local.style === 'object' && local.style !== null ? local.style : {})  }}
      onPointerDown={
        composeEventHandlers(
          local.onPointerDown as (e: PointerEvent & { currentTarget: HTMLDivElement; target: Element }) => void,
          (event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            scrollbarContext.onThumbPointerDown({
              x: event.clientX - rect.left,
              y: event.clientY - rect.top,
            });
          }
        )
      }
      onPointerUp={
        composeEventHandlers(
          local.onPointerUp as (e: PointerEvent & { currentTarget: HTMLDivElement; target: Element }) => void,
          () => scrollbarContext.onThumbPointerUp()
        )
      }
    />
  );
}
