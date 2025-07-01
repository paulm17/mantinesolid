import { Slider } from "@mantine/core";

export default function StoryComponent() {
  const marks = [
    { value: 20, label: '20%' },
    { value: 50, label: '50%' },
    { value: 80, label: '80%' },
  ];

  return (
    <div style={{ 'padding': '40px' }}>
      <Slider defaultValue={45} marks={marks} size="md" onChangeEnd={console.log} restrictToMarks />
    </div>
  );
}
