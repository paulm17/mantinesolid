import { createStore } from "solid-js/store";
import type { GetStylesApi, MantineSize } from "../../core";
import type { GridFactory } from "./Grid";

export type GridBreakpoints = Record<MantineSize, string>;

interface GridContextValue {
  getStyles: GetStylesApi<GridFactory>;
  grow: boolean | undefined;
  columns: number;
  breakpoints: GridBreakpoints | undefined;
  type: 'container' | 'media' | undefined;
}

const defaultGetStyles: GetStylesApi<GridFactory> = () => ({} as any);

export const [GridStore, SetGridStore] =
  createStore<GridContextValue>({
    getStyles: defaultGetStyles,
    grow: undefined,
    columns: 12,
    breakpoints: undefined,
    type: undefined,
  });

export const useGridStore = () => GridStore;
