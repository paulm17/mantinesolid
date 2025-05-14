import { useForm } from '@mantine/form';
import { CheckboxGroup } from '../CheckboxGroup/CheckboxGroup';
import { CheckboxIndicator } from '../CheckboxIndicator/CheckboxIndicator';
import { CheckboxCard } from './CheckboxCard';
import { createSignal } from 'solid-js';

export default { title: 'CheckboxCard' };

export function Usage() {
  const [checked, setChecked] = createSignal(false);
  return (
    <div style={{ 'padding': '40px' }}>
      <CheckboxCard p="md" checked={checked()} onClick={() => setChecked((c) => !c)}>
        <CheckboxIndicator />
        Some label
      </CheckboxCard>
    </div>
  );
}

export function WithinGroup() {
  const [value, setValue] = createSignal<string[]>(['1']);

  return (
    <div style={{ 'padding': '40px' }}>
      <CheckboxGroup value={value()} onChange={setValue}>
        <CheckboxCard
          value="1"
          checked={value().includes('1')}
          onClick={() => setValue((current) => (current.includes('1') ? [] : ['1']))}
        >
          <CheckboxIndicator />
          Option 1
        </CheckboxCard>

        <CheckboxCard
          value="2"
          checked={value().includes('2')}
          onClick={() => setValue((current) => (current.includes('2') ? [] : ['2']))}
        >
          <CheckboxIndicator />
          Option 2
        </CheckboxCard>
      </CheckboxGroup>

      <div>{JSON.stringify(value)}</div>
    </div>
  );
}

export function WithUseForm() {
  const form = useForm({ mode: 'uncontrolled', initialValues: { checkbox: true } });

  return (
    <div style={{ 'padding': '40px' }}>
      <CheckboxCard
        p="md"
        {...form.getInputProps('checkbox', { type: 'checkbox' })}
        key={form.key('checkbox')}
      >
        <CheckboxIndicator />
        Some label
      </CheckboxCard>

      {JSON.stringify(form.values)}
    </div>
  );
}
