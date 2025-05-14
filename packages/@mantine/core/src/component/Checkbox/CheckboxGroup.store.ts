import { Accessor, createContext, useContext } from 'solid-js';
import { MantineSize } from '../../core';

interface CheckboxGroupContextValue {
  value: Accessor<string[]>;
  onChange: (value: Event | string ) => void;
  size: Accessor<MantineSize | (string & {}) | undefined>;
}

const CheckboxGroupContext = createContext<CheckboxGroupContextValue | undefined>(undefined);
export const CheckboxGroupProvider = CheckboxGroupContext.Provider;
export const useCheckboxGroupContext = () => useContext(CheckboxGroupContext);

// import { createStore } from "solid-js/store";
// import { MantineSize } from '../../core';

// interface CheckboxGroupStore {
//   value: string[];
//   onChange: (value: string | Event) => void;
//   size: MantineSize | (string & {}) | undefined
// }

// export const [checkboxGroupStore, setCheckboxGroupStore] =
//   createStore<CheckboxGroupStore>({value: [], onChange: () => {}, size: undefined});
