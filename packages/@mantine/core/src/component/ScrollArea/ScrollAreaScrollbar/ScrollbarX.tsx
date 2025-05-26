import { createSignal, onMount, splitProps } from 'solid-js';
import { PossibleRef, useMergedRef } from '@mantine/hooks';
import { useScrollAreaContext } from '../ScrollArea.context';
import { ScrollAreaScrollbarAxisProps } from '../ScrollArea.types';
import { getThumbSize, isScrollingWithinScrollbarBounds, toInt } from '../utils';
import { Scrollbar } from './Scrollbar';

export function ScrollAreaScrollbarX(props: ScrollAreaScrollbarAxisProps) {
  const [local, others] = splitProps(props, [
    'sizes',
    'onSizesChange',
    'style',
    'ref'
  ]);

  const ctx = useScrollAreaContext();
  const [computedStyle, setComputedStyle] = createSignal<CSSStyleDeclaration>();
  const [ref, setRef] = createSignal<Element>();

  onMount(() => {
    if (ref()) {
      setComputedStyle(window.getComputedStyle(ref() as Element));
    }
  });

  return (
    <Scrollbar
      {...others}
      data-orientation="horizontal"
      ref={useMergedRef(local.ref, setRef)}
      sizes={local.sizes}
      style={{
        '--sa-thumb-width': `${getThumbSize(local.sizes)}px`,
        ...(typeof local.style === 'object' && local.style ? local.style : {}),
      }}
      onThumbPointerDown={(pointerPos: { x: number; y: number }) =>
        props.onThumbPointerDown(pointerPos.x)
      }
      onDragScroll={(pointerPos: { x: number; y: number }) =>
        props.onDragScroll(pointerPos.x)
      }
      onWheelScroll={(
        event: WheelEvent,
        maxScrollPos: number
      ) => {
        if (ctx.viewport) {
          const scrollPos = ctx.viewport.scrollLeft + event.deltaX;
          props.onWheelScroll(scrollPos);
          if (isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos)) {
            event.preventDefault();
          }
        }
      }}
      onResize={() => {
        if (ref() && ctx.viewport && computedStyle()) {
          local.onSizesChange({
            content: ctx.viewport.scrollWidth,
            viewport: ctx.viewport.offsetWidth,
            scrollbar: {
              size: ref()!.clientWidth,
              paddingStart: toInt(computedStyle()?.paddingLeft),
              paddingEnd: toInt(computedStyle()?.paddingRight),
            },
          });
        }
      }}
    />
  );
}

ScrollAreaScrollbarX.displayName = '@mantine/core/ScrollAreaScrollbarX';
