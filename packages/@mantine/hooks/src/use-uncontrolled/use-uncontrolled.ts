// src/hooks/use-uncontrolled.ts
import { createSignal, createMemo } from "solid-js";

export interface UseUncontrolledInput<T> {
  /** Value for controlled state */
  value?: T;

  /** Initial value for uncontrolled state */
  defaultValue?: T;

  /** Final value for uncontrolled state when value and defaultValue are not provided */
  finalValue?: T;

  /** Controlled state onChange handler */
  onChange?: (value: T, ...payload: any[]) => void;
}

export function useUncontrolled<T>({
  value,
  defaultValue,
  finalValue,
  onChange = () => {},
}: UseUncontrolledInput<T>): [() => T, (val: T, ...payload: any[]) => void] {
  const [uncontrolled, setUncontrolled] = createSignal<T>(
    defaultValue !== undefined ? defaultValue : (finalValue as T)
  );

  const isControlled = () => value !== undefined;

  const current = createMemo<T>(() =>
    isControlled() ? (value as T) : uncontrolled()
  );

  const setValue = (val: T, ...payload: any[]) => {
    if (!isControlled()) {
      if (typeof val === 'function') {
        setUncontrolled(() => val as any);
      } else {
        setUncontrolled(() => val);
      }
    }
    onChange(val, ...payload);
  };

  return [current, setValue];
}
