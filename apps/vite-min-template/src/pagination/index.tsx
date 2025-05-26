import { Button, Group, Pagination as MantinePagination } from "@mantine/core";
import { createSignal } from "solid-js";

export default function Pagination() {
  const [total, setTotal] = createSignal(20);

  return (
    <div style={{ 'padding': '40px' }}>
      <MantinePagination total={total()} mb="xl" />
      <Group>
        <Button onClick={() => setTotal(30)}>Set 30</Button>
        <Button onClick={() => setTotal(10)}>Set 10</Button>
      </Group>
    </div>
  );
}
