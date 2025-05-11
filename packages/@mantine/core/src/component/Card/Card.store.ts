import { createStore } from "solid-js/store";
import type { GetStylesApi } from "../../core";
import type { CardFactory } from "./Card";

interface CardStylesStore {
  getStyles: GetStylesApi<CardFactory>;
}

const defaultGetStyles: GetStylesApi<CardFactory> = () => ({} as any);

export const [cardStylesStore, setCardStylesStore] =
  createStore<CardStylesStore>({getStyles: defaultGetStyles});
