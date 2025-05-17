import { createStore } from "solid-js/store";
import type { GetStylesApi } from "../../core";
import type { ScrollAreaFactory } from './ScrollArea';

interface ScrollAreaContextValue {
  type: 'auto' | 'always' | 'scroll' | 'hover' | 'never';
  scrollHideDelay: number;
  scrollArea: HTMLDivElement | null;
  viewport: HTMLDivElement | null;
  onViewportChange: (viewport: HTMLDivElement | null) => void;
  content: HTMLDivElement | null;
  onContentChange: (content: HTMLDivElement) => void;
  scrollbarX: HTMLDivElement | null;
  onScrollbarXChange: (scrollbar: HTMLDivElement | null) => void;
  scrollbarXEnabled: boolean;
  onScrollbarXEnabledChange: (rendered: boolean) => void;
  scrollbarY: HTMLDivElement | null;
  onScrollbarYChange: (scrollbar: HTMLDivElement | null) => void;
  scrollbarYEnabled: boolean;
  onScrollbarYEnabledChange: (rendered: boolean) => void;
  onCornerWidthChange: (width: number) => void;
  onCornerHeightChange: (height: number) => void;
  getStyles: GetStylesApi<ScrollAreaFactory>;
}

const defaultGetStyles: GetStylesApi<ScrollAreaFactory> = () => ({} as any);

export const [ScrollAreaStore, SetScrollAreaStore] =
  createStore<ScrollAreaContextValue>({
    type: 'auto',
    scrollHideDelay: 500,
    scrollArea: null,
    viewport: null,
    onViewportChange: () => {},
    content: null,
    onContentChange: () => {},
    scrollbarX: null,
    onScrollbarXChange: () => {},
    scrollbarXEnabled: false,
    onScrollbarXEnabledChange: () => {},
    scrollbarY: null,
    onScrollbarYChange: () => {},
    scrollbarYEnabled: false,
    onScrollbarYEnabledChange: () => {},
    onCornerWidthChange: () => {},
    onCornerHeightChange: () => {},
    getStyles: defaultGetStyles
  });

export const useScrollAreaStore = () => ScrollAreaStore;
