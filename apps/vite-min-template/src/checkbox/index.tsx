import { Divider, Stack, Title } from "@mantine/core";
import CheckboxCard from "./CheckboxCard";
import GroupContext from "./GroupContext";
import GroupControlled from "./GroupControlled";
import CheckboxIndicatorStory from "./CheckboxIndicator";

export default function CheckboxStory() {
  return (
    <div style={{ 'padding': '40px' }}>
      <Stack>
        <Title>CheckboxCard</Title>
        <CheckboxCard />
        <Divider />
        <Title>CheckboxGroup - Controlled</Title>
        <GroupControlled />
        <Divider />
        <Title>CheckboxGroup - Context</Title>
        <GroupContext />
        <Divider />
        <Title>CheckboxIndicator</Title>
        <CheckboxIndicatorStory />
      </Stack>
    </div>
  );
}
