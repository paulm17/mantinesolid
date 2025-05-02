import type { JSX } from "solid-js";

type EventHandler<Elem extends Element, Evt extends Event> =
  JSX.EventHandler<Elem, Evt>;

export function createEventHandler<Elem extends Element, Evt extends Event>(
  parentEventHandler?: EventHandler<Elem, Evt>,
  eventHandler?: EventHandler<Elem, Evt>
): EventHandler<Elem, Evt> {
  return (event) => {
    parentEventHandler?.(event);
    eventHandler?.(event);
  };
}
