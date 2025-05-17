import { createStore } from "solid-js/store";
import type { GetStylesApi } from "../../core";
import type { TimelineFactory } from './Timeline';

interface TimelineContextValue {
  getStyles: GetStylesApi<TimelineFactory>;
}

const defaultGetStyles: GetStylesApi<TimelineFactory> = () => ({} as any);

export const [TimelineStore, SetTimelineStore] =
  createStore<TimelineContextValue>({getStyles: defaultGetStyles});

export const useTimelineStore = () => TimelineStore;
