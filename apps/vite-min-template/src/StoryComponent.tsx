import { IconSearch, IconTable } from '@tabler/icons-solidjs';
import { Button, Menu, Text } from "@mantine/core";

export default function StoryComponent() {
  return (
    <div style={{ padding: '40px', display: 'flex', 'justify-content': 'center' }}>
      <Menu width='200px' shadow="md">
        <Menu.Target>
          <Button>Toggle menu</Button>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>Label 1</Menu.Label>
          <Menu.Item>Item 1</Menu.Item>
          <Menu.Item closeMenuOnClick={false}>Won&apos;t close on click</Menu.Item>
          <Menu.Item disabled>Disabled</Menu.Item>

          <Menu.Item
            leftSection={<IconSearch size={14} />}
            rightSection={
              <Text size="xs" c="dimmed">
                ⌘K
              </Text>
            }
          >
            Search
          </Menu.Item>

          <Menu.Divider />

          <Menu.Label>Label 2</Menu.Label>
          <Menu.Item color="red" leftSection={<IconTable size={14} />}>
            Red color
          </Menu.Item>
          <Menu.Item leftSection={<IconTable size={14} />}>Button item 3</Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
}
