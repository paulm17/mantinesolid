import { Combobox, TextInput, useCombobox } from "@mantine/core";
import { createEffect, createSignal } from 'solid-js';

export function ComboUsageDemo() {
  const [opened, setOpened] = createSignal(true);
  const store = useCombobox({
    opened: () => opened(),
    onOpenedChange: (newValue) => {
      console.log('🟤 onOpenedChange called with:', newValue);
      setOpened(newValue);
    }
  });
  const [value, setValue] = createSignal('');

  createEffect(() => {
    console.log('🟢 Component opened state:', opened());
  })

  return (
    <div style={{ padding: '40px' }}>
      <Combobox
        store={store}
        withinPortal={false}
        onOptionSubmit={(val) => {
          setValue(val);
          store.closeDropdown();
          store.resetSelectedOption();
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
              store.openDropdown();
            }}
            onClick={() => store.openDropdown()}
          />
        </Combobox.Target>
        <Combobox.Dropdown>
          <Combobox.Header>Header</Combobox.Header>
          <Combobox.Options>
            <Combobox.Option value="react" className="test">
              React
            </Combobox.Option>
            <Combobox.Option value="vue" disabled>
              Vue
            </Combobox.Option>
            <Combobox.Option value="svelte">Svelte</Combobox.Option>
            <Combobox.Option value="angular">Angular</Combobox.Option>
          </Combobox.Options>
          <Combobox.Footer>Footer</Combobox.Footer>
        </Combobox.Dropdown>
      </Combobox>
    </div>
  );
}
