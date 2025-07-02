import { ComboboxParsedItem, ComboboxParsedItemGroup } from '../Combobox';

export interface NativeSelectOptionProps {
  data: ComboboxParsedItem;
}

function isGroup(input: ComboboxParsedItem): input is ComboboxParsedItemGroup {
  return 'group' in input;
}

export function NativeSelectOption({ data }: NativeSelectOptionProps) {
  if (isGroup(data)) {
    const items = data.items.map((item) => <NativeSelectOption data={item} />);
    return <optgroup label={data.group}>{items}</optgroup>;
  }

  const { value, label, ...others } = data;

  return (
    <option value={data.value} {...others}>
      {data.label}
    </option>
  );
}

NativeSelectOption.displayName = '@mantine/core/NativeSelectOption';
