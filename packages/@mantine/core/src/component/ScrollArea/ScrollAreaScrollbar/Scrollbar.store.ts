import { createStore } from "solid-js/store";

export interface ScrollbarContextValue {
  hasThumb: boolean;
  scrollbar: HTMLDivElement | null;
  onThumbChange: (thumb: HTMLDivElement | null) => void;
  onThumbPointerUp: () => void;
  onThumbPointerDown: (pointerPos: { x: number; y: number }) => void;
  onThumbPositionChange: () => void;
}

export const [ScrollAreaScrollbarStore, SetScrollAreaScrollbarStore] =
  createStore<ScrollbarContextValue>({
    hasThumb: false,
    scrollbar: null,
    onThumbChange: () => {},
    onThumbPointerUp: () => {},
    onThumbPointerDown: () => {},
    onThumbPositionChange: () => {},
  });

export const useScrollAreaScrollbarStore = () => ScrollAreaScrollbarStore;
