import dayjs from 'dayjs';
import { Button } from '@mantine/core';
import { YearPickerInput } from './YearPickerInput';
import { For } from 'solid-js';

export default { title: 'YearPickerInput' };

export function Usage() {
  return (
    <div style={{ padding: '40px', 'max-width': '400px' }}>
      <YearPickerInput label="Year picker input" placeholder="Pick year" defaultDate="1994-03-01" />
    </div>
  );
}

export function UncontrolledFormValues() {
  return (
    <form
      style={{ padding: '40px', 'max-width': '400px' }}
      onSubmit={(event) => {
        event.preventDefault();
        console.log(Object.fromEntries(new FormData(event.currentTarget) as any));
      }}
    >
      <YearPickerInput label="Year picker input" placeholder="Pick year" name="year-input" />
      <Button type="submit">Submit</Button>
    </form>
  );
}

export function Disabled() {
  return (
    <div style={{ padding: '40px', 'max-width': '400px' }}>
      <YearPickerInput label="Year picker input" placeholder="Pick year" disabled />
    </div>
  );
}

export function DropdownModal() {
  return (
    <div style={{ padding: '40px', 'max-width': '400px' }}>
      <YearPickerInput label="Year picker input" placeholder="Pick year" dropdownType="modal" />
    </div>
  );
}

export function Range() {
  return (
    <div style={{ padding: '40px' }}>
      <YearPickerInput type="range" label="Year picker input" />
    </div>
  );
}

export function Multiple() {
  return (
    <div style={{ padding: '40px' }}>
      <YearPickerInput type="multiple" label="Year picker input" />
    </div>
  );
}

export function SelectedDisabledYear() {
  return (
    <div style={{ padding: '40px' }}>
      <YearPickerInput
        label="Year picker input"
        defaultValue="2022-04-11"
        getYearControlProps={(date) => ({ disabled: dayjs(date).isSame('2022-04-11', 'year') })}
      />
    </div>
  );
}

export function WithMaxDate() {
  return (
    <div style={{ padding: '40px' }}>
      <YearPickerInput label="Year picker input" maxDate="2022-04-11" />
    </div>
  );
}

export function Clearable() {
  return (
    <div style={{ padding: '40px' }}>
      <YearPickerInput label="Default" clearable />
      <YearPickerInput label="Multiple" type="multiple" clearable />
      <YearPickerInput label="Range" type="range" clearable />
      <YearPickerInput
        label="Readonly"
        value={['2022-04-11', '2022-04-11']}
        type="range"
        clearable
        readOnly
      />
      <YearPickerInput
        label="Disabled"
        value={['2022-04-11', '2022-04-11']}
        type="range"
        clearable
        disabled
      />
    </div>
  );
}

export function Sizes() {
 const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

 return (
   <div style={{ padding: '40px' }}>
     <For each={sizes}>
       {(size) => (
         <YearPickerInput size={size} />
       )}
     </For>
   </div>
 );
}
