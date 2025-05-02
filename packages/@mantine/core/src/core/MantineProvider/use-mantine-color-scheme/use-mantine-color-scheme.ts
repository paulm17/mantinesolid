import { createMemo, onCleanup, useContext } from 'solid-js';
import { useColorScheme } from '@mantine/hooks';
import { noop } from '../../utils';
import { MantineContext, useMantineStyleNonce } from '../Mantine.context';
import { MantineColorScheme } from '../theme.types';

function disableTransition(nonce: string | undefined) {
  const style = document.createElement('style');
  style.setAttribute('data-mantine-styles', 'inline');
  style.innerHTML = '*, *::before, *::after {transition: none !important;}';
  style.setAttribute('data-mantine-disable-transition', 'true');
  nonce && style.setAttribute('nonce', nonce);

  document.head.appendChild(style);
  const clear = () =>
    document
      .querySelectorAll('[data-mantine-disable-transition]')
      .forEach((element) => element.remove());
  return clear;
}

export function useMantineColorScheme({ keepTransitions }: { keepTransitions?: boolean } = {}) {
  let clearStylesRef = noop;
  let timeoutRef = -1;
  const ctx = useContext(MantineContext);
  const nonce = useMantineStyleNonce();
  const nonceValue = nonce?.();

  if (!ctx) {
    throw new Error('[@mantine/core] MantineProvider was not found in tree');
  }

  const setColorScheme = (value: MantineColorScheme) => {
    ctx.setColorScheme(value);
    clearStylesRef = keepTransitions ? () => {} : disableTransition(nonceValue);
    window.clearTimeout(timeoutRef);
    timeoutRef = window.setTimeout(() => {
      clearStylesRef?.();
    }, 10);
  };

  const clearColorScheme = () => {
    ctx.clearColorScheme();
    clearStylesRef = keepTransitions ? () => {} : disableTransition(nonceValue);
    window.clearTimeout(timeoutRef);
    timeoutRef = window.setTimeout(() => {
      clearStylesRef?.();
    }, 10);
  };

  const osColorScheme = useColorScheme('light', { getInitialValueInEffect: false });
  const computedColorScheme = ctx.colorScheme === 'auto' ? osColorScheme : ctx.colorScheme;

  const toggleColorScheme = createMemo(
    () => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light'),
    [setColorScheme, computedColorScheme]
  );

  onCleanup(() => {
    clearStylesRef?.();
    window.clearTimeout(timeoutRef);
  });

  return {
    colorScheme: ctx.colorScheme,
    setColorScheme,
    clearColorScheme,
    toggleColorScheme,
  };
}
