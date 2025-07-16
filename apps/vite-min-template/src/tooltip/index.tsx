import { Box, Tooltip } from "@mantine/core";

export default function TooltipComponent() {
  return (
    <Box style={{width: "200px"}}>
      <Tooltip.Group openDelay={500}>
        <Tooltip label="Tooltip 1">
          {(props) => <button type="button" {...props}>Button 1</button>}
        </Tooltip>
        <Tooltip label="Tooltip 2">
          {(props) => <button type="button" {...props}>Button 2</button>}
        </Tooltip>
        <Tooltip label="Tooltip 3">
          {(props) => <button type="button" {...props}>Button 3</button>}
        </Tooltip>
      </Tooltip.Group>
    </Box>
  )
}
