import { CheckboxIndicator } from "@mantine/core";
import { createEffect, createSignal } from "solid-js";

export default function CheckboxIndicatorStory() {
  const [checked, setChecked] = createSignal(false);

  return (
    <CheckboxIndicator checked={checked()} onClick={() => setChecked((c) => !c)} />
  )
}
