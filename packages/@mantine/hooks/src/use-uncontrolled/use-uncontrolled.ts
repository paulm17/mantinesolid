import {
  type Accessor,
  createSignal,
  type Setter,
  type Signal,
  untrack,
} from 'solid-js'

/**
 * Creates a simple reactive state with a getter and setter. Can be controlled by providing your own state through the `value` prop.
 * @param props.value - Controlled value of the state.
 * @param props.defaultValue - Initial value of the state.
 * @param props.onChange - Callback fired when the value changes.
 * @returns ```typescript
 * [state: Accessor<T>, setState: Setter<T>]
 * ```
 */
function useUncontrolled<T>(props: {
  value?: Accessor<T | undefined>
  onChange?: (value: T) => void
}): Signal<T | undefined>
function useUncontrolled<T>(props: {
  value?: Accessor<T | undefined>
  defaultValue: T
  finalValue: T
  onChange?: (value: T) => void
}): Signal<T>
function useUncontrolled<T>(props: {
  value?: Accessor<T | undefined>
  defaultValue?: T
  finalValue?: T
  onChange?: (value: T) => void
}): Signal<T | undefined> {
  const [uncontrolledSignal, setUncontrolledSignal] = createSignal(
    props.defaultValue !== undefined? props.defaultValue : props.finalValue,
  )

  const isControlled = () => props.value?.() !== undefined
  const value = () =>
    isControlled() ? (props.value?.() as T) : uncontrolledSignal()

  const setValue: Setter<T | undefined> = (next?: unknown) => {
    return untrack(() => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
      let nextValue: Exclude<T, Function>
      if (typeof next === 'function') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
        nextValue = next(value()) as Exclude<T, Function>
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
        nextValue = next as Exclude<T, Function>
      }

      if (!Object.is(nextValue, value())) {
        if (!isControlled()) {
          setUncontrolledSignal(nextValue)
        }
        props.onChange?.(nextValue)
      }
      return nextValue as never
    })
  }

  return [value, setValue]
}

export { useUncontrolled }
