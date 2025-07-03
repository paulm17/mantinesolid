import { Button, Modal, useModalsStack } from "@mantine/core";
import { createEffect } from "solid-js";

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
  const stack = useModalsStack(['first', 'second', 'third']);

  console.log(stack.register('first'));

  createEffect(() => {
    console.log('Current stack state:', stack.state());
  })

  return (
    <div style={{ padding: '40px' }}>
      <Button onClick={() => stack.open('first')}>Open modal</Button>
      <Modal.Stack>
        <Modal {...stack.register('first')} title="First modal" overlayProps={{ blur: 3 }}>
          First modal
          {content}
          <Button onClick={() => stack.open('second')} fullWidth mt="md">
            Open second modal
          </Button>
        </Modal>

        <Modal {...stack.register('second')} title="Second modal" overlayProps={{ blur: 3 }}>
          Second modal
          <Button onClick={() => stack.open('third')} fullWidth mt="md">
            Open third modal
          </Button>
        </Modal>

        <Modal {...stack.register('third')} title="Third modal" overlayProps={{ blur: 3 }}>
          Third modal
          <Button onClick={() => stack.closeAll()} fullWidth mt="md">
            Close all
          </Button>
        </Modal>
      </Modal.Stack>
    </div>
  )
}
