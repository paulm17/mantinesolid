import { NativeSelect } from "@mantine/core";

export default function StoryComponent() {
  return (
    <div style={{ padding: '40px' }}>
      <NativeSelect data={['React', 'Angular', 'Vue']} />
    </div>
  )
}
