import { For, JSX } from 'solid-js';
import { Box, MantineProvider } from '../../core';
import { Avatar } from '../Avatar';
import { Group } from '../Group';
import { Text } from '../Text';
import { Indicator } from './Indicator';

export default {
  title: 'Indicator',
  decorators: [
    (Story: () => JSX.Element) => (
      <MantineProvider>
        <Story />
      </MantineProvider>
    ),
  ],
};

const positions = ['top', 'middle', 'bottom'] as const;
const placements = ['start', 'center', 'end'] as const;

export const Positions = () => {
  return (
    <Box p={40}>
      <For each={positions}>
        {(position) => (
          <Group mt="md">
            <For each={placements}>
              {(placement) => (
                <Indicator position={`${position}-${placement}`}>
                  <Avatar radius={0} />
                </Indicator>
              )}
            </For>
          </Group>
        )}
      </For>
    </Box>
  );
};

export const Inline = () => (
  <Box p={40}>
    <Indicator inline withBorder>
      <Avatar radius={0} />
    </Indicator>
  </Box>
);

export const AutoContrast = () => (
  <Box p={40}>
    <Indicator inline autoContrast withBorder color="lime.4" label="New" size={20}>
      <Avatar
        radius="xl"
        src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
      />
    </Indicator>
  </Box>
);

export const WithRadius = () => (
  <Box p={40}>
    <Indicator inline offset={12} size={20} position="bottom-end" withBorder color="red">
      <Avatar
        radius={50000}
        size="xl"
        src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
      />
    </Indicator>
  </Box>
);

export const WithLabel = () => (
  <Box p={40}>
    <Indicator inline label="New" size={18}>
      <Avatar radius={0} />
    </Indicator>
  </Box>
);

export const Processing = () => (
  <Box p={40}>
    <Group justify="center">
      <Box>
        <Text>Enabled</Text>
        <Indicator inline processing size={12}>
          <Avatar
            size="lg"
            src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
          />
        </Indicator>
      </Box>

      <Box>
        <Text>Disabled</Text>
        <Indicator inline processing disabled size={12}>
          <Avatar
            size="lg"
            src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
          />
        </Indicator>
      </Box>
    </Group>
  </Box>
);
