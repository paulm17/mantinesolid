import { createEffect, createSignal, splitProps, JSX } from 'solid-js';
import { DataAttributes, factory, Factory, MantineSize, useProps } from '../../../core';
import { Input, InputWrapperProps, InputWrapperStylesNames } from '../../Input';
import { InputsGroupFieldset } from '../../InputsGroupFieldset';
import { CheckboxGroupProvider } from '../CheckboxGroup.context';

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

export const CheckboxGroup = factory<CheckboxGroupFactory>((props, ref) => {
  const [local, others] = splitProps(
    useProps('CheckboxGroup', defaultProps, props),
    [
      'value',
      'defaultValue',
      'onChange',
      'size',
      'wrapperProps',
      'children',
      'readOnly'
    ]
  );

    const [internalValue, setInternalValue] = createSignal(
      local.value || local.defaultValue || []
    );

    // Update internal value when controlled value changes
    createEffect(() => {
      if (local.value !== undefined) {
        setInternalValue(local.value);
      }
    });

    const handleChange = (event: Event | string) => {
      if (local.readOnly) return;

      const itemValue = typeof event === 'string'
        ? event
        : (event.currentTarget as HTMLInputElement).value;

      const currentValue = internalValue();
      const newValue = currentValue.includes(itemValue)
        ? currentValue.filter(item => item !== itemValue)
        : [...currentValue, itemValue];

      setInternalValue(newValue);
      local.onChange?.(newValue);
    };

  return (
    <CheckboxGroupProvider value={{
      value: internalValue(),
      onChange: handleChange,
      size: local.size
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
