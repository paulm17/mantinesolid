import { Button, Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

const lorem =
  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum tenetur, atque animi ducimus tempora iste distinctio harum nostrum eos tempore voluptatem, voluptas dolorem eveniet fugiat pariatur! Repellendus minus nulla non?';
const content = Array(20)
  .fill(0)
  .map(_ => (
    <p style={{ margin: 0 }}>
      {lorem}
    </p>
  ));

export function DrawerApp() {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <div style={{ padding: '40px' }}>
      <Button onClick={open}>Open modal</Button>
      {content}
      <Button onClick={open}>Open modal</Button>
      <Drawer opened={opened} onClose={close} title="Just a Drawer" size="md" zIndex={73812}>
        <input data-autofocus />
      </Drawer>
    </div>
  );
}
