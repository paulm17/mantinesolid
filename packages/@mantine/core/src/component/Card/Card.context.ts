// import { createStore } from "solid-js/store";
// import type { GetStylesApi } from "../../core";
// import type { CardFactory } from "./Card";

// interface CardStylesStore {
//   getStyles: GetStylesApi<CardFactory>;
// }

// const defaultGetStyles: GetStylesApi<CardFactory> = () => ({} as any);

// export const [cardStylesStore, setCardStylesStore] =
//   createStore<CardStylesStore>({getStyles: defaultGetStyles});

import { createSafeContext, GetStylesApi } from '../../core';
import type { CardFactory } from './Card';

interface CardContextValue {
  getStyles: GetStylesApi<CardFactory>;
}

export const [CardProvider, useCardContext] = createSafeContext<CardContextValue>(
  'Card component was not found in tree'
);
