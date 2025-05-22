import { Ref } from '@solid-primitives/refs';
import { createOptionalContext, MantineSize } from '../../core';
import { InputVariant } from '../Input';

export interface PillsInputContextValue {
  fieldRef: Ref<HTMLInputElement | null>;
  size: MantineSize | (string & {});
  disabled: boolean | undefined;
  hasError: boolean | undefined;
  variant: InputVariant | (string & {}) | undefined;
}

export const [PillsInputProvider, usePillsInputContext] =
  createOptionalContext<PillsInputContextValue>();
