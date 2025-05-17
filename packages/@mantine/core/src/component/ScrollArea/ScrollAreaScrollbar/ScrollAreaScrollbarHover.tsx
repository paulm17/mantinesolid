import {
  createSignal,
  createEffect,
  onCleanup,
  splitProps,
  Show,
} from 'solid-js';
import { useScrollAreaStore } from '../ScrollArea.store';
import {
  ScrollAreaScrollbarAuto,
  ScrollAreaScrollbarAutoProps,
} from './ScrollAreaScrollbarAuto';

export interface ScrollAreaScrollbarHoverProps
  extends ScrollAreaScrollbarAutoProps {
  forceMount?: true;
}

export function ScrollAreaScrollbarHover(props: ScrollAreaScrollbarHoverProps) {
  const [local, others] = splitProps(props, ['forceMount', 'ref', 'orientation']);
  const store = useScrollAreaStore();
  const [visible, setVisible] = createSignal(false);

  createEffect(() => {
    const el = store.scrollArea;
    if (!el) return;

    let hideTimer: number;

    const onEnter = () => {
      window.clearTimeout(hideTimer);
      setVisible(true);
    };

    const onLeave = () => {
      hideTimer = window.setTimeout(() => setVisible(false), store.scrollHideDelay);
    };

    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointerleave', onLeave);

    onCleanup(() => {
      window.clearTimeout(hideTimer);
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointerleave', onLeave);
    });
  });

  return (
    <Show when={local.forceMount || visible()} fallback={null}>
      <ScrollAreaScrollbarAuto
        data-state={visible() ? 'visible' : 'hidden'}
        {...others}
        ref={local.ref}
      />
    </Show>
  );
}

ScrollAreaScrollbarHover.displayName = '@mantine/core/ScrollAreaScrollbarHover';
