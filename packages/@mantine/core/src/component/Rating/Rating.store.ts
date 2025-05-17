import { createStore } from "solid-js/store";
import type { GetStylesApi } from "../../core";
import type { RatingFactory } from './Rating';

interface RatingContextValue {
  getStyles: GetStylesApi<RatingFactory>;
}

const defaultGetStyles: GetStylesApi<RatingFactory> = () => ({} as any);

export const [RatingStore, SetRatingStore] =
  createStore<RatingContextValue>({getStyles: defaultGetStyles});

export const useRatingStore = () => RatingStore;
