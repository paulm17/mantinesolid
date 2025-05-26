import { CheckboxCard, CheckboxGroup, CheckboxIndicator, Stack } from "@mantine/core";
import { createSignal } from "solid-js";

export default function () {
  const [value, setValue] = createSignal<string[]>(['1']);

  return (
    <Stack>
      <CheckboxGroup value={value()} onChange={setValue}>
        <CheckboxCard
          value="1"
          checked={value().includes('1')}
          onClick={() => setValue((current) => (current.includes('1') ? [] : ['1']))}
        >
          <CheckboxIndicator />
          Option 1
        </CheckboxCard>

        <CheckboxCard
          value="2"
          checked={value().includes('2')}
          onClick={() => setValue((current) => (current.includes('2') ? [] : ['2']))}
        >
          <CheckboxIndicator />
          Option 2
        </CheckboxCard>
      </CheckboxGroup>

      <div>{JSON.stringify(value())}</div>
    </Stack>
  );
}

