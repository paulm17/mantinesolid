import { createSignal, createEffect, onCleanup } from 'solid-js';
import { useReducedMotion } from '@mantine/hooks';
import { useMantineTheme } from '../../core';

export type TransitionStatus =
  | 'entered'
  | 'exited'
  | 'entering'
  | 'exiting'
  | 'pre-exiting'
  | 'pre-entering';

interface UseTransition {
  duration: number;
  exitDuration: number;
  timingFunction: string;
  mounted: boolean;
  onEnter?: () => void;
  onExit?: () => void;
  onEntered?: () => void;
  onExited?: () => void;
  enterDelay?: number;
  exitDelay?: number;
}

export function useTransition(props: UseTransition) {
  const theme = useMantineTheme();
  const shouldReduceMotion = useReducedMotion();
  const reduceMotion = theme.respectReducedMotion ? shouldReduceMotion : false;
  const [transitionDuration, setTransitionDuration] = createSignal(reduceMotion ? 0 : props.duration);
  const [transitionStatus, setStatus] = createSignal<TransitionStatus>(props.mounted ? 'entered' : 'exited');
  let transitionTimeoutRef = -1;
  let delayTimeoutRef = -1;
  let rafRef = -1;

  const handleStateChange = (shouldMount: boolean) => {
    const preHandler = shouldMount ? props.onEnter : props.onExit;
    const handler = shouldMount ? props.onEntered : props.onExited;

    window.clearTimeout(transitionTimeoutRef);

    const newTransitionDuration = reduceMotion ? 0 : shouldMount ? props.duration : props.exitDuration;
    setTransitionDuration(newTransitionDuration);

    if (newTransitionDuration === 0) {
      typeof preHandler === 'function' && preHandler();
      typeof handler === 'function' && handler();
      setStatus(shouldMount ? 'entered' : 'exited');
    } else {
      // Make sure new status won't be set within the same frame as this would disrupt animation #3126
      rafRef = requestAnimationFrame(() => {
        setStatus(shouldMount ? 'pre-entering' : 'pre-exiting');

        rafRef = requestAnimationFrame(() => {
          typeof preHandler === 'function' && preHandler();
          setStatus(shouldMount ? 'entering' : 'exiting');

          transitionTimeoutRef = window.setTimeout(() => {
            typeof handler === 'function' && handler();
            setStatus(shouldMount ? 'entered' : 'exited');
          }, newTransitionDuration);
        });
      });
    }
  };

  const handleTransitionWithDelay = (shouldMount: boolean) => {
    window.clearTimeout(delayTimeoutRef);
    const delay = shouldMount ? props.enterDelay : props.exitDelay;

    if (typeof delay !== 'number') {
      handleStateChange(shouldMount);
      return;
    }

    delayTimeoutRef = window.setTimeout(
      () => {
        handleStateChange(shouldMount);
      },
      shouldMount ? props.enterDelay : props.exitDelay
    );
  };

  let isFirstRun = true;
  createEffect(() => {
    // Access the mounted value to create dependency
    const isMounted = props.mounted;

    if (isFirstRun) {
      isFirstRun = false;
      return;
    }

    handleTransitionWithDelay(isMounted);
  });

  onCleanup(() => {
    window.clearTimeout(transitionTimeoutRef);
    cancelAnimationFrame(rafRef);
  });

  return {
    transitionDuration,
    transitionStatus,
    transitionTimingFunction: props.timingFunction || 'ease',
  };
}
