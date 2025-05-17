import { createSignal, onMount, splitProps } from 'solid-js';
import { PossibleRef, useMergedRef } from '@mantine/hooks';
import { useScrollAreaStore } from '../ScrollArea.store';
import { ScrollAreaScrollbarAxisProps } from '../ScrollArea.types';
import { getThumbSize, isScrollingWithinScrollbarBounds, toInt } from '../utils';
import { Scrollbar } from './Scrollbar';

export function ScrollAreaScrollbarY(props: ScrollAreaScrollbarAxisProps) {
  const [local, others] = splitProps(props, [
    'sizes',
    'onSizesChange',
    'style',
    'ref',
  ]);

  const store = useScrollAreaStore();
  const [computedStyle, setComputedStyle] = createSignal<CSSStyleDeclaration>();
  const [ref, setRef] = createSignal<PossibleRef<HTMLDivElement>>();

  onMount(() => {
    if (ref()) {
      setComputedStyle(window.getComputedStyle(ref()));
    }
  });

  return (
    <Scrollbar
      {...others}
      data-orientation="vertical"
      ref={useMergedRef(local.ref, setRef)}
      sizes={local.sizes}
      style={{
        "--sa-thumb-height": `${getThumbSize(local.sizes)}px`,
        ...(typeof local.style === 'object' && local.style !== null ? local.style : {})
      }}
      onThumbPointerDown={(pointerPos: { x: number; y: number }) =>
        props.onThumbPointerDown(pointerPos.y)
      }
      onDragScroll={(pointerPos: { x: number; y: number }) =>
        props.onDragScroll(pointerPos.y)
      }
      onWheelScroll={(
        event: WheelEvent,                                                         // :contentReference[oaicite:16]{index=16}
        maxScrollPos: number
      ) => {
        if (store.viewport) {
          const scrollPos = store.viewport.scrollTop + event.deltaY;
          props.onWheelScroll(scrollPos);
          if (isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos)) {
            event.preventDefault();
          }
        }
      }}
      onResize={() => {
        if (ref() && store.viewport && computedStyle()) {
          local.onSizesChange({
            content: store.viewport.scrollHeight,
            viewport: store.viewport.offsetHeight,
            scrollbar: {
              size: ref().clientHeight,
              paddingStart: toInt(computedStyle()?.paddingTop),
              paddingEnd: toInt(computedStyle()?.paddingBottom),
            },
          });
        }
      }}
    />
  );
}

ScrollAreaScrollbarY.displayName = '@mantine/core/ScrollAreaScrollbarY';
