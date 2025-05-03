import { onMount, onCleanup, createSignal } from 'solid-js';
import { getEnv } from '../../core';
import { toInt } from '../ScrollArea/utils';
import { useTimeout } from '@mantine/hooks';

function isParent(
  parentElement: HTMLElement | EventTarget | null,
  childElement: HTMLElement | null
) {
  if (!childElement || !parentElement) return false;

  let parent = childElement.parentNode;
  while (parent) {
    if (parent === parentElement) return true;
    parent = parent.parentNode;
  }
  return false;
}

interface UseFloatingIndicatorInput {
  target: HTMLElement | null | undefined;
  parent: HTMLElement | null | undefined;
  ref: () => HTMLDivElement | undefined;
  displayAfterTransitionEnd?: boolean;
}

export function useFloatingIndicator({ target, parent, ref, displayAfterTransitionEnd }: UseFloatingIndicatorInput) {
  let transitionTimeout: number;
  const [initialized, setInitialized] = createSignal(false);
  const [hidden, setHidden] = createSignal(
    typeof displayAfterTransitionEnd === 'boolean' ? displayAfterTransitionEnd : false
  );

  const updatePosition = () => {
    const el = ref();
    if (!target || !parent || !el) return;

    const targetRect = target.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();
    const targetStyle = window.getComputedStyle(target);
    const parentStyle = window.getComputedStyle(parent);

    const borderTop = toInt(targetStyle.borderTopWidth) + toInt(parentStyle.borderTopWidth);
    const borderLeft = toInt(targetStyle.borderLeftWidth) + toInt(parentStyle.borderLeftWidth);

    const top = targetRect.top - parentRect.top - borderTop;
    const left = targetRect.left - parentRect.left - borderLeft;

    el.style.transform = `translateY(${top}px) translateX(${left}px)`;
    el.style.width = `${targetRect.width}px`;
    el.style.height = `${targetRect.height}px`;
  };

  const updatePositionWithoutAnimation = () => {
    clearTimeout(transitionTimeout);
    const el = ref();
    if (el) el.style.transitionDuration = '0ms';
    updatePosition();
    transitionTimeout = window.setTimeout(() => {
      const el2 = ref();
      if (el2) el2.style.transitionDuration = '';
    }, 30);
  };

  onMount(() => {
    updatePosition();

    // observe size changes on target and parent
    let targetObserver: ResizeObserver | null = null;
    let parentObserver: ResizeObserver | null = null;

    if (target) {
      targetObserver = new ResizeObserver(updatePositionWithoutAnimation);
      targetObserver.observe(target);
    }

    if (parent) {
      parentObserver = new ResizeObserver(updatePositionWithoutAnimation);
      parentObserver.observe(parent);

      const handleTransitionEnd = (event: TransitionEvent) => {
        if (isParent(event.target, parent)) {
          updatePositionWithoutAnimation();
          setHidden(false);
        }
      };

      parent.addEventListener('transitionend', handleTransitionEnd);
      onCleanup(() => parent.removeEventListener('transitionend', handleTransitionEnd));
    }

    onCleanup(() => {
      targetObserver?.disconnect();
      parentObserver?.disconnect();
    });

    // watch for dir attribute changes on document element
    const mutationObserver = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'attributes' && m.attributeName === 'dir') {
          updatePositionWithoutAnimation();
        }
      }
    });
    mutationObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['dir'] });
    onCleanup(() => mutationObserver.disconnect());
  });

  // delay initialization to avoid React-act warning equivalent
  const { start } = useTimeout(() => {
    if (getEnv() !== 'test') setInitialized(true);
  }, 20, { autoInvoke: true });

  return { initialized: () => initialized(), hidden: () => hidden() };
}
