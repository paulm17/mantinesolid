import { Autocomplete } from "@mantine/core";

export default function StoryComponent() {
  return (
    <div style={{ padding: '40px' }}>
      <Autocomplete
        data={[
          'React',
          'Angular',
          'Svelte',
          'Vue',
          'Ember',
          'Backbone',
          'Preact',
          'Inferno',
          'Aurelia',
          'Meteor',
        ]}
        placeholder="Select something"
      />
    </div>
  )
}
