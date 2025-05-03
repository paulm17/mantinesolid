// use-merged-ref.ts
import { mergeRefs, type Ref } from "@solid-primitives/refs";    // mergeRefs chains multiple refs :contentReference[oaicite:1]{index=1}

/** A ref callback or signal-style ref used by Solid primitives */
export type PossibleRef<T> = Ref<T> | undefined;

export function assignRef<T>(
  ref: ((el: T) => void) | { current?: T } | undefined,
  value: T
) {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref && typeof ref === "object") {
    (ref as any).current = value;
  }
}

/**
 * Exactly the same API shape as Mantine’s React hook:
 *   useMergedRef(ref1, ref2, …)
 *
 * Accepts any number of refs (callback or signal) and returns
 * a single `Ref<T>` callback to attach to JSX `ref={…}`.
 */
export function useMergedRef<T>(...refs: PossibleRef<T>[]): Ref<T> {
  // filter out undefined, then chain them
  return mergeRefs<T>(...refs.filter((r): r is Ref<T> => !!r));
}
