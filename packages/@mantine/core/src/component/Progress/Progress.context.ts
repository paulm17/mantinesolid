// import { createSafeContext, GetStylesApi } from '../../core';
// import type { ProgressRootFactory } from './ProgressRoot/ProgressRoot';

// interface ProgressContextValue {
//   getStyles: GetStylesApi<ProgressRootFactory>;
//   autoContrast: boolean | undefined;
// }

// export const [ProgressProvider, useProgressContext] = createSafeContext<ProgressContextValue>(
//   'Progress.Root component was not found in tree'
// );

import { createStore } from "solid-js/store";
import type { GetStylesApi } from "../../core";
import type { ProgressRootFactory } from './ProgressRoot/ProgressRoot';

interface ProgressContextValue {
  getStyles: GetStylesApi<ProgressRootFactory>;
  autoContrast: boolean | undefined;
}

const defaultGetStyles: GetStylesApi<ProgressRootFactory> = () => ({} as any);

export const [ProgressStore, SetProgressStore] =
  createStore<ProgressContextValue>({
    getStyles: defaultGetStyles,
    autoContrast: undefined
});

export const useProgressStore = () => ProgressStore;
