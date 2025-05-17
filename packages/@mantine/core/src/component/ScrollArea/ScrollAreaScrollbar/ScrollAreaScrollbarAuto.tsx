import {
  createSignal,
  splitProps,
  Show,
} from 'solid-js';
import { useDebouncedCallback } from '@mantine/hooks';
import { useScrollAreaStore } from '../ScrollArea.store';
import { useResizeObserver } from '../use-resize-observer';
import {
  ScrollAreaScrollbarVisible,
  ScrollAreaScrollbarVisibleProps,
} from './ScrollAreaScrollbarVisible';

export interface ScrollAreaScrollbarAutoProps
  extends ScrollAreaScrollbarVisibleProps {
  forceMount?: true;
}

export function ScrollAreaScrollbarAuto(props: ScrollAreaScrollbarAutoProps) {
  const [local, others] = splitProps(props, [
    'forceMount',
    'ref',
    'orientation'
  ]);
  const store = useScrollAreaStore();
  const [visible, setVisible] = createSignal(false);
  const isHorizontal = () => local.orientation === 'horizontal';

  const handleResize = useDebouncedCallback(() => {
    if (store.viewport) {
      const overflowX = store.viewport.offsetWidth < store.viewport.scrollWidth;
      const overflowY = store.viewport.offsetHeight < store.viewport.scrollHeight;
      setVisible(isHorizontal() ? overflowX : overflowY);
    }
  }, 10);

  useResizeObserver(() => store.viewport, handleResize);
  useResizeObserver(() => store.content, handleResize);

  return (
    <Show when={local.forceMount || visible()} fallback={null}>
      <ScrollAreaScrollbarVisible
        data-state={visible() ? 'visible' : 'hidden'}
        {...others}
        ref={local.ref}
      />
    </Show>
  );
}

ScrollAreaScrollbarAuto.displayName = '@mantine/core/ScrollAreaScrollbarAuto';
