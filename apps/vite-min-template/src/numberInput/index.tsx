import { Button, Group, Input, InputBase, NumberFormatter, NumberInput, NumberInputHandlers, PinInput, Stack, Text } from "@mantine/core";
import { createSignal } from "solid-js";

export default function NumInput() {
  const [value, setValue] = createSignal<number | string>('133');
  const [value2, setValue2] = createSignal('');
  const [handlersRef, setHandlersRef] = createSignal<NumberInputHandlers |  null>(null);

  return (
    <div style={{ 'padding': '40px' }}>
      <Stack>
        <NumberInput
          handlersRef={setHandlersRef}
          value={value()}
          label="Number input"
          placeholder="Number input"
          onChange={(value) => {
            console.log('StoryComponent onChange:', value);
            setValue(value);
          }}
          onValueChange={console.log}
        />
        {typeof value() === 'number' ? `${value()} number` : `${value() === '' ? 'empty' : value()} string`}
        <Button onClick={() => setValue(245.32)}>Set value to float</Button>
        <Button onClick={() => handlersRef()?.increment()} color="red">Increment</Button>
        <Button onClick={() => handlersRef()?.decrement()} color="red">Decrement</Button>
        <Group>
          <Text>Input</Text>
          <Input
            placeholder="Clearable input"
            value={value()}
            onChange={(event) => setValue(event.currentTarget.value)}
            rightSection={value() !== '' ? <Input.ClearButton onClick={() => setValue('')} /> : undefined}
            rightSectionPointerEvents="auto"
            size="sm"
          />
        </Group>
        <Group>
          <Text>InputBase</Text>
          <InputBase
            placeholder="Input base"
            value={value()}
            onChange={(event) => setValue(event.currentTarget.value)}
            rightSection={value()!== ''? <Input.ClearButton onClick={() => setValue('')} /> : undefined}
            rightSectionPointerEvents="auto"
            size="sm"
          />
        </Group>

        <PinInput value={value2()} onChange={setValue2} />
        Value: {value()}
        <NumberFormatter
          value={-1022233.34}
          decimalScale={3}
          decimalSeparator="dec"
          fixedDecimalScale
          thousandSeparator
          prefix="$ "
          suffix=" R$"
          class="test"
        />
      </Stack>
    </div>
  );
}
