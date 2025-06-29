import { JSX } from 'solid-js/jsx-runtime';
import type { FlipOptions, InlineOptions, ShiftOptions, SizeOptions } from '@floating-ui/solid';

export type PopoverWidth = 'target' | JSX.CSSProperties['width'] | null;

export interface PopoverMiddlewares {
  shift?: boolean | ShiftOptions;
  flip?: boolean | FlipOptions;
  inline?: boolean | InlineOptions;
  size?: boolean | SizeOptions;
}
