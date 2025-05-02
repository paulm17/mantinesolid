import { createEffect, onCleanup, splitProps } from 'solid-js';
import { PossibleRef, useMergedRef } from '@mantine/hooks';
import { useScrollAreaContext } from '../ScrollArea.context';
import { ScrollAreaScrollbarAuto } from './ScrollAreaScrollbarAuto';
import { ScrollAreaScrollbarHover } from './ScrollAreaScrollbarHover';
import { ScrollAreaScrollbarScroll } from './ScrollAreaScrollbarScroll';
import {
  ScrollAreaScrollbarVisible,
  ScrollAreaScrollbarVisibleProps,
} from './ScrollAreaScrollbarVisible';

export interface ScrollAreaScrollbarProps extends ScrollAreaScrollbarVisibleProps {
  forceMount?: true;
}

export function ScrollAreaScrollbar(props: ScrollAreaScrollbarProps) {
  const [local, others] = splitProps(props, [
    'forceMount',
    'ref',
    'orientation'
  ]);

  const ctx = useScrollAreaContext();
  const isHorizontal = () => local.orientation === 'horizontal';

  createEffect(() => {
    if (isHorizontal()) ctx.onScrollbarXEnabledChange(true);
    else ctx.onScrollbarYEnabledChange(true);

    onCleanup(() => {
      if (isHorizontal()) ctx.onScrollbarXEnabledChange(false);
      else ctx.onScrollbarYEnabledChange(false);
    });
  });

  const rootRef = useMergedRef(local.ref as PossibleRef<HTMLDivElement>, (el) => {
    if (el) {
      isHorizontal() ? ctx.onScrollbarXEnabledChange(true) : ctx.onScrollbarYEnabledChange(true);
    }
  });

  return ctx.type === 'hover' ? (
    <ScrollAreaScrollbarHover {...others} ref={rootRef} forceMount={local.forceMount} />
  ) : ctx.type === 'scroll' ? (
    <ScrollAreaScrollbarScroll {...others} ref={rootRef} forceMount={local.forceMount} />
  ) : ctx.type === 'auto' ? (
    <ScrollAreaScrollbarAuto {...others} ref={rootRef} forceMount={local.forceMount} />
  ) : ctx.type === 'always' ? (
    <ScrollAreaScrollbarVisible {...others} ref={rootRef} />
  ) : null;
}

ScrollAreaScrollbar.displayName = '@mantine/core/ScrollAreaScrollbar';
