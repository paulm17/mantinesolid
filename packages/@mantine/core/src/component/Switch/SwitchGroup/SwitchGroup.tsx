import { useUncontrolled } from '@mantine/hooks';
import { DataAttributes, factory, Factory, MantineSize, useProps } from '../../../core';
import { Input, InputWrapperProps, InputWrapperStylesNames } from '../../Input';
import { InputsGroupFieldset } from '../../InputsGroupFieldset';
import { SwitchGroupProvider } from '../SwitchGroup.context';
import { JSX } from 'solid-js/jsx-runtime';
import { splitProps } from 'solid-js';

export type SwitchGroupStylesNames = InputWrapperStylesNames;

export interface SwitchGroupProps extends Omit<InputWrapperProps, 'onChange'> {
  /** `Switch` components */
  children: JSX.Element;

  /** Controlled component value */
  value?: string[];

  /** Default value for uncontrolled component */
  defaultValue?: string[];

  /** Called when value changes */
  onChange?: (value: string[]) => void;

  /** Props passed down to the `Input.Wrapper` */
  wrapperProps?: JSX.HTMLAttributes<HTMLDivElement> & DataAttributes;

  /** Controls size of the `Input.Wrapper`, `'sm'` by default */
  size?: MantineSize | (string & {});

  /** If set, value cannot be changed */
  readOnly?: boolean;
}

export type SwitchGroupFactory = Factory<{
  props: SwitchGroupProps;
  ref: HTMLDivElement;
  stylesNames: SwitchGroupStylesNames;
}>;

const defaultProps: Partial<SwitchGroupProps> = {};

export const SwitchGroup = factory<SwitchGroupFactory>((_props, ref) => {
  const props = useProps('SwitchGroup', defaultProps, _props);

  const [local, others] = splitProps(props, [
    'value',
    'defaultValue',
    'onChange',
    'size',
    'wrapperProps',
    'children',
    'readOnly',
    'ref'
  ]);

  const [_value, setValue] = useUncontrolled({
    value: local.value,
    defaultValue: local.defaultValue,
    finalValue: [],
    onChange: local.onChange,
  });

  const handleChange = (event: Event) => {
    const itemValue = (event.currentTarget as HTMLInputElement)?.value;
    !local.readOnly &&
      setValue(
        _value().includes(itemValue)
          ? _value().filter((item) => item !== itemValue)
          : [..._value(), itemValue]
      );
  };

  return (
    <SwitchGroupProvider value={{ value: _value(), onChange: handleChange, size: local.size }}>
      <Input.Wrapper
        size={local.size}
        ref={ref}
        {...local.wrapperProps}
        {...others}
        labelElement="div"
        __staticSelector="SwitchGroup"
      >
        <InputsGroupFieldset role="group">{local.children}</InputsGroupFieldset>
      </Input.Wrapper>
    </SwitchGroupProvider>
  );
});

SwitchGroup.classes = Input.Wrapper.classes;
SwitchGroup.displayName = '@mantine/core/SwitchGroup';
