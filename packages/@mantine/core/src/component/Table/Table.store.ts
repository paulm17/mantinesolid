import { createStore } from "solid-js/store";
import type { GetStylesApi } from "../../core";
import type { TableFactory } from './Table';

export interface TableContextValue {
  getStyles: GetStylesApi<TableFactory>;
  stickyHeader: boolean | undefined;
  striped: 'odd' | 'even' | undefined;
  highlightOnHover: boolean | undefined;
  withColumnBorders: boolean | undefined;
  withRowBorders: boolean | undefined;
  captionSide: 'top' | 'bottom';
}

const defaultGetStyles: GetStylesApi<TableFactory> = () => ({} as any);

export const [TableStore, SetTableStore] =
  createStore<TableContextValue>({
    getStyles: defaultGetStyles,
    stickyHeader: undefined,
    striped: undefined,
    highlightOnHover: undefined,
    withColumnBorders: undefined,
    withRowBorders: undefined,
    captionSide: 'top',
});

export const useTableStore = () => TableStore;
