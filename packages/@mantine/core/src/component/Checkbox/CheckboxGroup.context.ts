import { createContext, useContext } from 'solid-js';
import { MantineSize } from '../../core';

interface CheckboxGroupContextValue {
  value: string[];
  onChange: (value: string | Event) => void;
  size: MantineSize | (string & {}) | undefined;
}

const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(null);
export const CheckboxGroupProvider = CheckboxGroupContext.Provider;
export const useCheckboxGroupContext = () => useContext(CheckboxGroupContext);
