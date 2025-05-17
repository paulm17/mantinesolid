import { createOptionalContext, MantineSize } from '../../core';

interface RadioGroupContextValue {
  size: MantineSize | undefined;
  value: string;
  onChange: (event: Event | string) => void;
  name: string;
}

export const [RadioGroupProvider, useRadioGroupContext] =
  createOptionalContext<RadioGroupContextValue>();
