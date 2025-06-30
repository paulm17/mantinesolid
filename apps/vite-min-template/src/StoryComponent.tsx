import { Tooltip } from "@mantine/core";

export default function StoryComponent() {
  return (
    <div style={{ padding: '40px' }}>
      <Tooltip
        position="right"
        label="Tooltip label"
        withArrow
        transitionProps={{ duration: 0 }}
        opened
        color="cyan"
        radius="md"
      >
        <button type="button">target</button>
      </Tooltip>
    </div>
  );
}
