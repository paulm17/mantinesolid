import { ActionIcon } from '../ActionIcon';
import { VisuallyHidden } from './VisuallyHidden';

export default { title: 'VisuallyHidden' };

export function Usage() {
  return (
    <div style={{ 'padding': '40px' }}>
      <ActionIcon>
        <VisuallyHidden>Pronounce this</VisuallyHidden>
        $$
      </ActionIcon>
    </div>
  );
}
