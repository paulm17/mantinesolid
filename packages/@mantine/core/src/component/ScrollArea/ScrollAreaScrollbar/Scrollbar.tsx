import { JSX, createSignal, createEffect, onCleanup, onMount, splitProps } from 'solid-js';
import { useScrollAreaContext } from '../ScrollArea.context';
import { Sizes } from '../ScrollArea.types';
import { useDebouncedCallback, useMergedRef } from '@mantine/hooks';
import { composeEventHandlers } from '../utils';
import {
  ScrollbarContextValue,
  ScrollbarProvider,
} from './Scrollbar.context';

export interface ScrollbarPrivateProps {
  sizes: Sizes;
  hasThumb: boolean;
  onThumbChange: ScrollbarContextValue['onThumbChange'];
  onThumbPointerUp: ScrollbarContextValue['onThumbPointerUp'];
  onThumbPointerDown: ScrollbarContextValue['onThumbPointerDown'];
  onThumbPositionChange: ScrollbarContextValue['onThumbPositionChange'];
  onWheelScroll: (event: WheelEvent, maxScrollPos: number) => void;
  onDragScroll: (pointerPos: { x: number; y: number }) => void;
  onResize: () => void;
}

export function Scrollbar(props: ScrollbarPrivateProps & JSX.HTMLAttributes<HTMLDivElement>) {
  const [local, scrollbarProps] = splitProps(props, [
    'sizes',
    'hasThumb',
    'onThumbChange',
    'onThumbPointerUp',
    'onThumbPointerDown',
    'onThumbPositionChange',
    'onDragScroll',
    'onWheelScroll',
    'onResize',
    'ref',
  ]);

  const context = useScrollAreaContext();
  const [scrollbar, setScrollbar] = createSignal<HTMLDivElement |  null>(null);
  const composeRefs = useMergedRef(local.ref, (node: HTMLDivElement) => setScrollbar(node));
  let rect: DOMRect | null = null;
  let prevWebkitUserSelect = '';

  const maxScrollPos = () => local.sizes.content - local.sizes.viewport;

  // debounced resize
  const handleResize = useDebouncedCallback(local.onResize, 10);

  // wheel handling on document
  const wheelListener = (e: WheelEvent) => {
    const target = e.target as HTMLElement;
    if (scrollbar()?.contains(target)) {
      local.onWheelScroll(e, maxScrollPos());
    }
  };
  onMount(() => {
    document.addEventListener('wheel', wheelListener, { passive: false } as AddEventListenerOptions);
  });
  onCleanup(() => {
    document.removeEventListener('wheel', wheelListener, { passive: false } as AddEventListenerOptions);
  });

  // update thumb position when sizes change
  createEffect(() => local.onThumbPositionChange());

  // resize observer
  onMount(() => {
    const obs = new ResizeObserver(handleResize);
    if (scrollbar()) obs.observe(scrollbar()!);
    if (context.content) obs.observe(context.content);
    onCleanup(() => obs.disconnect());
  });

  return (
    <ScrollbarProvider
      value={{
        scrollbar: scrollbar(),
        hasThumb: local.hasThumb,
        onThumbChange: local.onThumbChange,
        onThumbPointerUp: local.onThumbPointerUp,
        onThumbPositionChange: local.onThumbPositionChange,
        onThumbPointerDown: local.onThumbPointerDown,
      }}
    >
      <div
        {...scrollbarProps}
        ref={composeRefs}
        data-mantine-scrollbar
        style={{
          position: 'absolute',
          ...(typeof scrollbarProps.style === 'object' && scrollbarProps.style !== null ? scrollbarProps.style : {})
        }}
        onPointerDown={composeEventHandlers(local.onThumbPointerDown, (e: PointerEvent) => {
          e.preventDefault();
          if (e.button === 0) {
            const el = e.currentTarget as HTMLElement;
            el.setPointerCapture(e.pointerId);
            rect = scrollbar()!.getBoundingClientRect();
            prevWebkitUserSelect = document.body.style.webkitUserSelect;
            document.body.style.webkitUserSelect = 'none';
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            local.onDragScroll({ x, y });
          }
        })}
        onPointerMove={composeEventHandlers(local.onThumbPositionChange, (e: PointerEvent) => {
          if (rect) {
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            local.onDragScroll({ x, y });
          }
        })}
        onPointerUp={composeEventHandlers(local.onThumbPointerUp, (e: PointerEvent) => {
          const el = e.currentTarget as HTMLElement;
          if (el.hasPointerCapture(e.pointerId)) {
            e.preventDefault();
            el.releasePointerCapture(e.pointerId);
          }
        })}
        onLostPointerCapture={() => {
          document.body.style.webkitUserSelect = prevWebkitUserSelect;
          rect = null;
        }}
      />
    </ScrollbarProvider>
  );
}
