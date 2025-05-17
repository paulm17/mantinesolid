import { createEffect, Match, onCleanup, splitProps, Switch } from 'solid-js';
import { useScrollAreaStore } from '../ScrollArea.store';
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

  const store = useScrollAreaStore();
  const isHorizontal = () => local.orientation === 'horizontal';

  createEffect(() => {
    if (isHorizontal()) store.onScrollbarXEnabledChange(true);
    else store.onScrollbarYEnabledChange(true);

    onCleanup(() => {
      if (isHorizontal()) store.onScrollbarXEnabledChange(false);
      else store.onScrollbarYEnabledChange(false);
    });
  });

  return (
    <Switch fallback={null}>
      <Match when={store.type === "hover"}>
        <ScrollAreaScrollbarHover {...others} ref={local.ref} forceMount={local.forceMount} />
      </Match>
      <Match when={store.type === "scroll"}>
        <ScrollAreaScrollbarScroll {...others} ref={local.ref} forceMount={local.forceMount} />
      </Match>
      <Match when={store.type === "auto"}>
        <ScrollAreaScrollbarAuto {...others} ref={local.ref} forceMount={local.forceMount} />
      </Match>
      <Match when={store.type === "always"}>
        <ScrollAreaScrollbarVisible {...others} ref={local.ref} />
      </Match>
    </Switch>
  );
}

ScrollAreaScrollbar.displayName = '@mantine/core/ScrollAreaScrollbar';
