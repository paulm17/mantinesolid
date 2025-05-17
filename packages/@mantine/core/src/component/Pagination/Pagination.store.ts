// import { createSafeContext, GetStylesApi } from '../../core';
// import type { PaginationRootFactory } from './PaginationRoot/PaginationRoot';

// interface PaginationContext {
//   total: number;
//   range: (number | 'dots')[];
//   active: number;
//   disabled: boolean | undefined;
//   getItemProps?: (page: number) => Record<string, any>;
//   onChange: (page: number) => void;
//   onNext: () => void;
//   onPrevious: () => void;
//   onFirst: () => void;
//   onLast: () => void;
//   getStyles: GetStylesApi<PaginationRootFactory>;
// }

// export const [PaginationProvider, usePaginationContext] = createSafeContext<PaginationContext>(
//   'Pagination.Root component was not found in tree'
// );

import { createStore } from "solid-js/store";
import type { GetStylesApi } from "../../core";
import type { PaginationRootFactory } from './PaginationRoot/PaginationRoot';

interface PaginationContextValue {
  total: number;
  range: (number | 'dots')[];
  active: number;
  disabled: boolean | undefined;
  getItemProps?: (page: number) => Record<string, any>;
  onChange: (page: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  onFirst: () => void;
  onLast: () => void;
  getStyles: GetStylesApi<PaginationRootFactory>;
}

const defaultGetStyles: GetStylesApi<PaginationRootFactory> = () => ({} as any);

export const [PaginationStore, SetPaginationStore] =
  createStore<PaginationContextValue>({
    getStyles: defaultGetStyles,
    total: 0,
    range: [],
    active: 0,
    disabled: undefined,
    getItemProps: undefined,
    onChange: () => {},
    onNext: () => {},
    onPrevious: () => {},
    onFirst: () => {},
    onLast: () => {},
  });

export const usePaginationStore = () => PaginationStore;
