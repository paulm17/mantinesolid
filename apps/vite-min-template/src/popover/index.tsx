import { Box, Popover } from "@mantine/core";

export default function PopoverComponent() {
  return (
    <Box style={{width: "200px"}}>
      <Popover withArrow width='400px'>
        <Popover.Target>
          <button type="button">arrow popover</button>
        </Popover.Target>

        <Popover.Dropdown>Dropdown with arrow</Popover.Dropdown>
      </Popover>
    </Box>
  )
}

