import { ColorInput } from "@mantine/core";


export default function StoryComponent() {
  return (
    <div style={{ 'padding': '40px' }}>
      <ColorInput
        label="Input label"
        description="Input description"
        placeholder="Input placeholder"
      />
    </div>
  );
}
