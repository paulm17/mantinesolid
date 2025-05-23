import type { SetRequired } from 'type-fest';
import type { TransitionOverride } from '../Transition';
import { mergeProps } from 'solid-js';

type MinimalTransitionOverride = SetRequired<TransitionOverride, 'duration' | 'transition'>;

const defaultTransition: MinimalTransitionOverride = {
  duration: 100,
  transition: 'fade',
};

export function getTransitionProps(
  transitionProps: TransitionOverride | undefined,
  componentTransition: TransitionOverride | undefined
): MinimalTransitionOverride {
  return mergeProps ({ ...defaultTransition, ...componentTransition, ...transitionProps });
}
