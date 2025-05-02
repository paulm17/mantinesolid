import { JSX } from 'solid-js/jsx-runtime';
import { MantineTransition, transitions } from '../transitions';

const transitionStatuses = {
  entering: 'in',
  entered: 'in',
  exiting: 'out',
  exited: 'out',
  'pre-exiting': 'out',
  'pre-entering': 'out',
} as const;

export function getTransitionStyles({
  transition,
  state,
  duration,
  timingFunction,
}: {
  transition: MantineTransition;
  state: keyof typeof transitionStatuses;
  duration: number;
  timingFunction: JSX.CSSProperties['transition-timing-function'];
}): JSX.CSSProperties {
  const shared: JSX.CSSProperties = {
    '--webkit-backface-visibility': 'hidden',
    'will-change': 'transform, opacity',
    'transition-duration': `${duration}ms`,
    'transition-timing-function': timingFunction,
  };

  if (typeof transition === 'string') {
    if (!(transition in transitions)) {
      return {};
    }

    return {
      'transition-property': transitions[transition].transitionProperty,
      ...shared,
      ...transitions[transition].common,
      ...transitions[transition][transitionStatuses[state]],
    };
  }

  return {
    'transition-property': transition.transitionProperty,
    ...shared,
    ...transition.common,
    ...transition[transitionStatuses[state]],
  };
}
