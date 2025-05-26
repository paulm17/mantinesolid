import { Checkbox, Group, Stack, Text } from "@mantine/core";
import { createSignal } from "solid-js";
import classes from "./Demo.module.css";

export default function CheckboxCard() {
  const [checked4, setChecked4] = createSignal(false);

  return (
    <Stack>
      <Checkbox.Card
        className={classes.root}
        radius="md"
        checked={checked4()}
        onClick={() => setChecked4((c) => !c)}
      >
        <Group wrap="nowrap" align="flex-start">
          <Checkbox.Indicator />
          <div>
            <Text className={classes.label}>@mantine/core</Text>
            <Text className={classes.description}>
              Core components library: inputs, buttons, overlays, etc.
            </Text>
          </div>
        </Group>
      </Checkbox.Card>
    </Stack>
  );
}

