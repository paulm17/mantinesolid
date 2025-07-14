import { JSX, splitProps, Show, createEffect } from 'solid-js';
import { Transition as SolidTransition } from 'solid-transition-group';
import { useMantineEnv } from '../../core';
import { getTransitionStyles } from './get-transition-styles/get-transition-styles';
import type { MantineTransition } from './transitions';

export interface TransitionProps {
  /** If set element will not be unmounted when hidden */
  keepMounted?: boolean;
  /** Transition name or object */
  transition?: MantineTransition;
  /** Enter transition duration in ms */
  duration?: number;
  /** Exit transition duration in ms */
  exitDuration?: number;
  /** CSS timing function */
  timingFunction?: string;
  /** Controls mount state */
  mounted: boolean;
  /** Render prop receiving CSS styles */
  children: (styles: JSX.CSSProperties) => JSX.Element;
  onExited?: () => void;
  onExit?: () => void;
  onEnter?: () => void;
  onEntered?: () => void;
  enterDelay?: number;
  exitDelay?: number;
}

export type TransitionOverride = Partial<Omit<TransitionProps, 'mounted'>>;

export function Transition(props: TransitionProps) {
  const env = useMantineEnv();
  const [local] = splitProps(props, [
    'keepMounted', 'transition', 'duration', 'exitDuration', 'timingFunction',
    'mounted', 'children', 'onExited', 'onExit', 'onEnter', 'onEntered', 'enterDelay', 'exitDelay'
  ]);

  const duration = local.duration ?? 250;
  const exitDuration = local.exitDuration ?? duration;
  const timingFunction = local.timingFunction ?? 'ease';

  const mkStyles = (state: Parameters<typeof getTransitionStyles>[0]['state'], dur: number) =>
    getTransitionStyles({ transition: local.transition ?? 'fade', state, duration: dur, timingFunction });

  function animate(
    el: HTMLElement,
    fromState: Parameters<typeof getTransitionStyles>[0]['state'],
    toState: Parameters<typeof getTransitionStyles>[0]['state'],
    dur: number,
    cb?: () => void
  ) {
    const from = mkStyles(fromState, dur);
    const to = mkStyles(toState, dur);
    const onAnimationEnd = () => {
      // After exiting, apply the final hidden styles which should include display: 'none'
      if (toState === 'exiting') {
        Object.assign(el.style, mkStyles('exited', dur));
      }
      cb?.();
    };

    // Before entering, ensure the element is visible
    if (toState === 'entering') {
      el.style.display = ''; // Reset display to default
    }

    Object.assign(el.style, from);
    requestAnimationFrame(() => {
      Object.assign(el.style, { transition: `all ${dur}ms ${timingFunction}`, ...to });
    });

    setTimeout(onAnimationEnd, dur);
  }

  // No-animation fallback
  // if (env === 'test' || (duration === 0 && exitDuration === 0)) {
  //   return local.mounted
  //     ? <>{local.children({})}</>
  //     : local.keepMounted
  //       ? local.children({ display: 'block' })
  //       : null;
  // }
  if (env === 'test' || (duration === 0 && exitDuration === 0)) {
    return (
      <Show when={local.mounted || local.keepMounted} fallback={null}>
        {local.children(local.mounted ? {} : { display: 'none' })}
      </Show>
    );
  }

  // createEffect(() => {
  //   console.log('styles', mkStyles('entered', duration))
  // })

  return (
    <SolidTransition
      appear
      mode="inout"
      onBeforeEnter={el => el instanceof HTMLElement && Object.assign(el.style, mkStyles('pre-entering', duration))}
      onEnter={(el, done) => {
        if (!(el instanceof HTMLElement)) return done();
        local.onEnter?.();
        animate(el, 'pre-entering', 'entering', duration, () => {
          local.onEntered?.();
          done();
        });
      }}
      onAfterEnter={el => el instanceof HTMLElement && Object.assign(el.style, mkStyles('entered', duration))}
      onBeforeExit={el => el instanceof HTMLElement && Object.assign(el.style, mkStyles('pre-exiting', exitDuration))}
      onExit={(el, done) => {
        if (!(el instanceof HTMLElement)) return done();
        local.onExit?.();
        animate(el, 'exiting', 'exiting', exitDuration, () => {
          local.onExited?.();
          done();
        });
      }}
      onAfterExit={el => el instanceof HTMLElement && Object.assign(el.style, mkStyles('exited', exitDuration))}
    >
      {/* <Show when={local.mounted || local.keepMounted} fallback={null}> */}
        {/* {local.children(local.mounted ? mkStyles('entered', duration) : { display: 'block' })} */}
        {local.children({display:'block'})}
      {/* </Show> */}
    </SolidTransition>
  );
}

Transition.displayName = '@mantine/core/Transition';
