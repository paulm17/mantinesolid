import { splitProps } from 'solid-js';
import { BoxProps, ElementProps, factory, Factory, StylesApiProps, useProps } from '../../core';
import { ComboboxChevron, ComboboxData, getParsedComboboxData } from '../Combobox';
import { __BaseInputProps, __InputStylesNames } from '../Input';
import { InputBase } from '../InputBase';
import { NativeSelectOption } from './NativeSelectOption';

export interface NativeSelectProps
  extends BoxProps,
    Omit<__BaseInputProps, 'pointer'>,
    StylesApiProps<NativeSelectFactory>,
    ElementProps<'select', 'size'> {
  /** Data used to render options, can be replaced with `children` */
  data?: ComboboxData;
}

export type NativeSelectFactory = Factory<{
  props: NativeSelectProps;
  ref: HTMLSelectElement;
  stylesNames: __InputStylesNames;
}>;

const defaultProps: Partial<NativeSelectProps> = {
  rightSectionPointerEvents: 'none',
};

export const NativeSelect = factory<NativeSelectFactory>((_props, ref) => {
  const props = useProps('NativeSelect', defaultProps, _props);
  const [local, others] = splitProps(props, [
    'data',
    'children',
    'size',
    'error',
    'rightSection',
    'unstyled',
    'ref'
  ]);

  const options = getParsedComboboxData(local.data).map((item: any, index: any) => (
    <NativeSelectOption key={index} data={item} />
  ));

  return (
    <InputBase
      component="select"
      ref={ref}
      {...others}
      __staticSelector="NativeSelect"
      size={local.size}
      pointer
      error={local.error}
      unstyled={local.unstyled}
      rightSection={
        local.rightSection || <ComboboxChevron size={local.size} error={local.error} unstyled={local.unstyled} />
      }
    >
      {local.children || options}
    </InputBase>
  );
});

NativeSelect.classes = InputBase.classes;
NativeSelect.displayName = '@mantine/core/NativeSelect';
