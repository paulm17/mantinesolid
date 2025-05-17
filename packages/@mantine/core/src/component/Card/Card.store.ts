import { createStore } from "solid-js/store";
import type { GetStylesApi } from "../../core";
import type { CardFactory } from "./Card";

interface CardContextValue {
  getStyles: GetStylesApi<CardFactory>;
}

const defaultGetStyles: GetStylesApi<CardFactory> = () => ({} as any);

export const [CardStore, SetCardStore] =
  createStore<CardContextValue>({getStyles: defaultGetStyles});

export const useCardStore = () => CardStore;
