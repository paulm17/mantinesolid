import { splitProps, JSX } from 'solid-js';
import { useId, useUncontrolled } from '@mantine/hooks';
import { DataAttributes, factory, Factory, MantineSize, useProps } from '../../../core';
import { Input, InputWrapperProps, InputWrapperStylesNames } from '../../Input';
import { InputsGroupFieldset } from '../../InputsGroupFieldset';
import { RadioGroupProvider } from '../RadioGroup.context';

export type RadioGroupStylesNames = InputWrapperStylesNames;

export interface RadioGroupProps
  extends Omit<InputWrapperProps, 'onChange' | 'value' | 'defaultValue'> {
  /** `Radio` components and any other elements */
  children: JSX.Element;

  /** Controlled component value */
  value?: string | null;

  /** Default value for uncontrolled component */
  defaultValue?: string | null;

  /** Called when value changes */
  onChange?: (value: string) => void;

  /** Props passed down to the `Input.Wrapper` */
  wrapperProps?: JSX.HTMLAttributes<HTMLDivElement> & DataAttributes;

  /** Controls size of the `Input.Wrapper`, `'sm'` by default */
  size?: MantineSize;

  /** `name` attribute of child radio inputs. By default, `name` is generated randomly. */
  name?: string;

  /** If set, value cannot be changed */
  readOnly?: boolean;
}

export type RadioGroupFactory = Factory<{
  props: RadioGroupProps;
  ref: HTMLDivElement;
  stylesNames: RadioGroupStylesNames;
}>;

const defaultProps: Partial<RadioGroupProps> = {};

export const RadioGroup = factory<RadioGroupFactory>((_props, ref) => {
  const props = useProps('RadioGroup', defaultProps, _props);
  const [local, others] = splitProps(props, [
    'value',
    'defaultValue',
    'onChange',
    'size',
    'wrapperProps',
    'children',
    'name',
    'readOnly'
  ]);

  const _name = useId(local.name);

  const [_value, setValue] = useUncontrolled({
    value: local.value as string,
    defaultValue: local.defaultValue as string,
    finalValue: '',
    onChange: local.onChange,
  });

  const handleChange = (event: Event | string) =>
    !local.readOnly && setValue(typeof event === 'string' ? event : (event.currentTarget as HTMLInputElement)?.value);

  return (
    <RadioGroupProvider value={{ value: _value(), onChange: handleChange, size: local.size, name: _name }}>
      <Input.Wrapper
        size={local.size}
        ref={ref}
        {...local.wrapperProps}
        {...others}
        labelElement="div"
        __staticSelector="RadioGroup"
      >
        <InputsGroupFieldset role="radiogroup">{local.children}</InputsGroupFieldset>
      </Input.Wrapper>
    </RadioGroupProvider>
  );
});

RadioGroup.classes = Input.Wrapper.classes;
RadioGroup.displayName = '@mantine/core/RadioGroup';
