import { Button, Modal } from "@mantine/core";
import PopoverComponent from "./popover";
import { useDisclosure } from "@mantine/hooks";

const lorem =
  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum tenetur, atque animi ducimus tempora iste distinctio harum nostrum eos tempore voluptatem, voluptas dolorem eveniet fugiat pariatur! Repellendus minus nulla non?';

function generateContent(count: number) {
  return Array(count)
    .fill(0)
    .map(_ => (
      <p style={{ margin: 0 }}>
        {lorem}
      </p>
    ));
}

const content = generateContent(20);

export default function StoryComponent() {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <div style={{ padding: '40px' }}>
      <Button onClick={open}>Open modal</Button>
      {content}
      <Button onClick={open}>Open modal</Button>
      <Modal
        opened={opened}
        onClose={close}
        title="Just a Modal"
        transitionProps={{ duration: 500, onExited: () => console.log('onExited') }}
        onExitTransitionEnd={() => console.log('onExitTransitionEnd')}
      >
        <input data-autofocus />
      </Modal>
    </div>
  )
}
