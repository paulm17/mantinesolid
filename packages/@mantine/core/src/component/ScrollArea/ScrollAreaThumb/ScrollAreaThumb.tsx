import { onMount, onCleanup, JSX, splitProps, Show } from 'solid-js';
import { useDebouncedCallback, useMergedRef } from '@mantine/hooks';    // your Solid version
import { useScrollAreaStore } from '../ScrollArea.store';       // assume rewritten as Solid context
import { useScrollAreaScrollbarStore } from '../ScrollAreaScrollbar/Scrollbar.store';
import { addUnlinkedScrollListener, composeEventHandlers } from '../utils';

interface ThumbProps extends JSX.HTMLAttributes<HTMLDivElement> {}

export function Thumb(props: ThumbProps) {
  const [local, others] = splitProps(props, [
    "style", "onPointerDown", "onPointerUp", "ref"
  ]);

  const scrollAreaStore = useScrollAreaStore();
  const scrollbarStore = useScrollAreaScrollbarStore();

  const composedRef = useMergedRef(local.ref, (el: HTMLDivElement) => scrollbarStore.onThumbChange(el));

  const removeListenerRef: { current?: () => void } = {};
  const debounceScrollEnd = useDebouncedCallback(() => {
    removeListenerRef.current?.();
    removeListenerRef.current = undefined;
  }, 100);

  onMount(() => {
    const viewport = scrollAreaStore.viewport;
    if (!viewport) return;

    // initial position
    scrollbarStore.onThumbPositionChange();

    const handleScroll = () => {
      debounceScrollEnd();
      if (!removeListenerRef.current) {
        removeListenerRef.current = addUnlinkedScrollListener(viewport, scrollbarStore.onThumbPositionChange);
        scrollbarStore.onThumbPositionChange();
      }
    };

    viewport.addEventListener('scroll', handleScroll);
    // cleanup
    onCleanup(() => viewport.removeEventListener('scroll', handleScroll));
  });

  return (
    <div
      data-state={scrollbarStore.hasThumb ? 'visible' : 'hidden'}
      {...others}
      ref={composedRef}
      style={{ width: 'var(--sa-thumb-width)', height: 'var(--sa-thumb-height)', ...(typeof local.style === 'object' && local.style !== null ? local.style : {})  }}
      onPointerDown={
        composeEventHandlers(
          local.onPointerDown as (e: PointerEvent & { currentTarget: HTMLDivElement; target: Element }) => void,
          (event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            scrollbarStore.onThumbPointerDown({
              x: event.clientX - rect.left,
              y: event.clientY - rect.top,
            });
          }
        )
      }
      onPointerUp={
        composeEventHandlers(
          local.onPointerUp as (e: PointerEvent & { currentTarget: HTMLDivElement; target: Element }) => void,
          () => scrollbarStore.onThumbPointerUp()
        )
      }
    />
  );
}

interface ScrollAreaThumbProps extends ThumbProps {
  forceMount?: true;
  ref?: HTMLDivElement;
}

export function ScrollAreaThumb(props: ScrollAreaThumbProps) {
  const [local, thumbProps] = splitProps(props, [
    'forceMount',
    'ref'
  ]);
  const scrollbarStore = useScrollAreaScrollbarStore();

  return (
    <Show when={local.forceMount || scrollbarStore.hasThumb}>
      <Thumb ref={local.ref} {...thumbProps} />
    </Show>
  );
}

ScrollAreaThumb.displayName = '@mantine/core/ScrollAreaThumb';
