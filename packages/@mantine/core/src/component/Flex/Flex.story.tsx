import { Button } from '../Button';
import { Flex } from './Flex';

export default { title: 'Flex' };

export function Usage() {
  return (
    <div style={{ 'padding': '40px' }}>
      <Flex>
        <Button>First</Button>
        <Button>Second</Button>
      </Flex>
    </div>
  );
}
