import { Checkbox, Group, Stack, Text } from "@mantine/core";
import { createSignal, For, Index } from "solid-js";
import classes from './Demo.module.css';

export default function GroupContext() {
  const [value2, setValue2] = createSignal<string[]>([]);

  const data = [
  {
    name: '@mantine/core',
    description: 'Core components library: inputs, buttons, overlays, etc.',
  },
  { name: '@mantine/hooks', description: 'Collection of reusable hooks for React applications.' },
  { name: '@mantine/notifications', description: 'Notifications system' },
];

  return (<>
      <Stack>
        <Checkbox.Group
            value={value2()}
            onChange={setValue2}
            label="Pick packages to install"
            description="Choose all packages that you will need in your application"
          >
            <Stack pt="md" gap="xs">
              <Index each={data}>
                {(_, index) => (
                  <Checkbox.Card className={classes.root} radius="md" value={data[index].name}>
                    <Group wrap="nowrap" align="flex-start">
                      <Checkbox.Indicator />
                      <div>
                        <Text className={classes.label}>{data[index].name}</Text>
                        <Text className={classes.description}>{data[index].description}</Text>
                      </div>
                    </Group>
                  </Checkbox.Card>
                )}
              </Index>
            </Stack>
        </Checkbox.Group>

        <Text fz="xs" mt="md">
          CurrentValue: {value2().join(', ') || '–'}
        </Text>
      </Stack>
  </>)
};
