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

  let el: HTMLDivElement | undefined;

  const rootRef = useMergedRef<HTMLDivElement>(
    local.ref as PossibleRef<HTMLDivElement>,
    (node) => {
      el = node;
      ctx.onScrollbarXChange(node);
    }
  );

  onMount(() => {
    if (el) {
      setComputedStyle(window.getComputedStyle(el));
    }
  });

  return (
    <Scrollbar
      {...others}
      data-orientation="horizontal"
      ref={rootRef}
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
        if (el && ctx.viewport && computedStyle()) {
          local.onSizesChange({
            content: ctx.viewport.scrollWidth,
            viewport: ctx.viewport.offsetWidth,
            scrollbar: {
              size: el.clientWidth,
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
