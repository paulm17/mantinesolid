import { RingProgress } from "@mantine/core";

export default function StoryComponent() {
  return (
    <div style={{ 'padding': '40px' }}>
        <RingProgress
          label="Hello"
          sections={[
            {
              value: 10,
              color: 'blue.4',
            },
            {
              value: 10,
              color: 'red.1',
            },
            {
              value: 10,
              color: 'orange.9',
            },
          ]}
        />
        {/* <Tooltip
          position="right"
          label="Tooltip label"
          withArrow
          transitionProps={{ duration: 0 }}
          opened
          color="cyan"
          radius="md"
        >
          <button type="button">target</button>
        </Tooltip> */}
    </div>
  );
}
