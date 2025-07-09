import { useDisclosure } from '@mantine/hooks'; // Your existing hook
import { MinimalFocusTrap } from './focus'; // Import the new component

export default function StoryComponent() {
  const [active, handlers] = useDisclosure(false);

  return (
    <>
      <button type="button" onClick={handlers.toggle}>
        Toggle
      </button>

      {/* Use the new, simpler component */}
      <MinimalFocusTrap active={active()}>
        <div>
          <p>I am inside the trap.</p>
          <input placeholder="First Input" />
          <input placeholder="Second Input" />
          <button type="button">A Button</button>
        </div>
      </MinimalFocusTrap>
    </>
  );
}
