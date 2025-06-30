import { Accessor, createContext, useContext } from 'solid-js';
import { MantineSize } from '../../core';

interface CheckboxGroupContextValue {
  value: Accessor<string[]>;
  onChange: (value: Event | string ) => void;
  size: Accessor<MantineSize | (string & {}) | undefined>;
}

const CheckboxGroupContext = createContext<CheckboxGroupContextValue | undefined>(undefined);
export const CheckboxGroupProvider = CheckboxGroupContext.Provider;
export const useCheckboxGroupContext = () => useContext(CheckboxGroupContext)!;
