import { Combobox, TextInput, useCombobox } from "@mantine/core";
import { createSignal, For } from 'solid-js';

export function ComboboxActiveDemo() {
  const store = useCombobox();
  const [active, setActive] = createSignal<string | null>(null);
  const [value, setValue] = createSignal('');

  const fruitsData = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Orange', value: 'orange' },
    { label: 'Grape', value: 'grape' },
    { label: 'Mango', value: 'mango' },
    { label: 'Pineapple', value: 'pineapple' },
  ];


  return (
    <div style={{ padding: '40px' }}>
      <Combobox
        store={store}
        withinPortal={false}
        onOptionSubmit={(val) => {
          setActive(val);
          setValue(fruitsData.find((fruit) => fruit.value === val)!.label);
        }}
      >
        <Combobox.Target>
          <TextInput
            placeholder="Pick a value"
            onFocus={() => store.openDropdown()}
            onBlur={() => store.closeDropdown()}
            value={value()}
            onChange={(event) => {
              setValue(event.currentTarget.value);
            }}
          />
        </Combobox.Target>
        <Combobox.Dropdown>
          <Combobox.Options>
            <For each={fruitsData}>
              {(fruit) => (
                <Combobox.Option value={fruit.value} active={active() === fruit.value}>
                  {active() === fruit.value && '✓'} {fruit.label}
                </Combobox.Option>
              )}
            </For>
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
    </div>
  );
}
