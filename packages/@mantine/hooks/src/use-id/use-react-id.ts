import { createUniqueId } from "solid-js";

export function useReactId() {
  const id = createUniqueId();
  return id ? `mantine-${id.replace(/:/g, '')}` : '';
}
