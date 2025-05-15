import { splitProps, JSX, onMount } from 'solid-js';
import { DataAttributes, factory, Factory, MantineSize, useProps } from '../../../core';
import { Input, InputWrapperProps, InputWrapperStylesNames } from '../../Input';
import { InputsGroupFieldset } from '../../InputsGroupFieldset';
import { CheckboxGroupProvider } from '../CheckboxGroup.store';
import { useControlled } from '@mantine/hooks';

export type CheckboxGroupStylesNames = InputWrapperStylesNames;

export interface CheckboxGroupProps extends Omit<InputWrapperProps, 'onChange'> {
  /** `Checkbox` components and any other elements */
  children: JSX.Element;

  /** Controlled component value */
  value?: string[];

  /** Default value for uncontrolled component */
  defaultValue?: string[];

  /** Called with an array of selected checkboxes values when value changes */
  onChange?: (value: string[]) => void;

  /** Props passed down to the root element (`Input.Wrapper` component) */
  wrapperProps?: JSX.HTMLAttributes<HTMLDivElement> & DataAttributes;

  /** Controls size of the `Input.Wrapper`, `'sm'` by default */
  size?: MantineSize | (string & {});

  /** If set, value cannot be changed */
  readOnly?: boolean;
}

export type CheckboxGroupFactory = Factory<{
  props: CheckboxGroupProps;
  ref: HTMLDivElement;
  stylesNames: CheckboxGroupStylesNames;
}>;

const defaultProps: Partial<CheckboxGroupProps> = {};

export const CheckboxGroup = factory<CheckboxGroupFactory>((_props, ref) => {
  const props = useProps('Checkbox', defaultProps, _props);
  const [local, others] = splitProps(props, [
    'value',
    'defaultValue',
    'onChange',
    'size',
    'wrapperProps',
    'children',
    'readOnly'
  ]);

  const [_value, setValue] = useControlled({
    value: () => local.value,
    initialValue: local.defaultValue!,
    // finalValue: [],
    onChange: local.onChange,
  });

  const handleChange = (event: Event | string) => {
    const itemValue = typeof event === 'string'
      ? event
      : (event.currentTarget as HTMLInputElement).value;

    if (!local.readOnly) {
      setValue(
        _value().includes(itemValue)
          ? _value().filter((item) => item !== itemValue)
          : [..._value(), itemValue]
      );
    }
  };

  return (
    <CheckboxGroupProvider value={{
      value: _value,
      onChange: handleChange,
      size: () => local.size
    }}>
      <Input.Wrapper
        size={local.size}
        ref={ref}
        {...local.wrapperProps}
        {...others}
        labelElement="div"
        __staticSelector="CheckboxGroup"
      >
        <InputsGroupFieldset role="group">{local.children}</InputsGroupFieldset>
      </Input.Wrapper>
    </CheckboxGroupProvider>
  );
});

CheckboxGroup.classes = Input.Wrapper.classes;
CheckboxGroup.displayName = '@mantine/core/CheckboxGroup';
