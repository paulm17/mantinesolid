import { Button, Modal } from "@mantine/core";
import { createSignal } from "solid-js";

export default function StoryComponent() {
  const [opened, setOpened] = createSignal(false);

  return (
    <div style={{ padding: '40px' }}>
      <Button onClick={() => setOpened(true)}>Open Modal In Stack</Button>
      <Modal.Stack>
        <Modal opened={opened()} onClose={() => setOpened(false)} title="Modal In Stack">
          <p>Does this modal appear correctly when it is the only item inside a Stack?</p>
        </Modal>
      </Modal.Stack>
    </div>
  );
}
