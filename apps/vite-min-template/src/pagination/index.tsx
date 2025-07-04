import { Pagination as MantinePagination } from "@mantine/core";
import { createSignal } from "solid-js";

export default function Pagination() {
  const [total, setTotal] = createSignal(20);

  return (
    <div style={{ 'padding': '40px' }}>
      <MantinePagination total={total()} mb="xl" />
      {/* <Group> */}
        <button onClick={() => setTotal(30)}>Set 30</button>
        <button onClick={() => setTotal(10)}>Set 10</button>
      {/* </Group> */}
    </div>
  );
}
