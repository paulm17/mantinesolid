import { Box, Tooltip } from "@mantine/core";

export default function TooltipComponent() {
  return (
    <Box style={{width: "200px"}}>
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
    </Box>
  )
}
