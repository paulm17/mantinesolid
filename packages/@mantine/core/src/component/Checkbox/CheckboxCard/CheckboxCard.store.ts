import { Accessor } from 'solid-js';
import { createOptionalContext } from '../../../core';

export interface CheckboxCardContextValue {
  checked: Accessor<boolean>;
}

export const [CheckboxCardProvider, useCheckboxCardContext] =
  createOptionalContext<CheckboxCardContextValue>();

// import { createStore } from "solid-js/store";

// interface CheckboxCardStore {
//   checked: boolean;
// }

// export const [checkboxCardStore, setCheckboxCardStore] =
//   createStore<CheckboxCardStore>({checked: false});
