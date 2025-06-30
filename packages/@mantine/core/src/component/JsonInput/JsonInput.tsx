import { createSignal, splitProps, JSX } from 'solid-js';
import { factory, Factory, useProps } from '../../core';
import { __InputStylesNames } from '../Input';
import { InputBase } from '../InputBase';
import { Textarea, TextareaProps } from '../Textarea';
import { validateJson } from './validate-json/validate-json';

export interface JsonInputProps extends Omit<TextareaProps, 'onChange'> {
  /** Value for controlled component */
  value?: string;

  /** Default value for uncontrolled component */
  defaultValue?: string;

  /** Called when value changes */
  onChange?: (value: string) => void;

  /** Determines whether the value should be formatted on blur, `false` by default */
  formatOnBlur?: boolean;

  /** Error message displayed when value is not valid JSON */
  validationError?: JSX.Element;

  /** Function to serialize value into a string, used for value formatting, `JSON.stringify` by default */
  serialize?: typeof JSON.stringify;

  /** Function to deserialize string value, used for value formatting and input JSON validation, must throw error if string cannot be processed, `JSON.parse` by default */
  deserialize?: typeof JSON.parse;
}

export type JsonInputFactory = Factory<{
  props: JsonInputProps;
  ref: HTMLTextAreaElement;
  stylesNames: __InputStylesNames;
}>;

const defaultProps: Partial<JsonInputProps> = {
  serialize: JSON.stringify,
  deserialize: JSON.parse,
};

export const JsonInput = factory<JsonInputFactory>(_props => {
  const props = useProps('JsonInput', defaultProps, _props);
  const [local, others] = splitProps(props, [
    'value',
    'defaultValue',
    'onChange',
    'formatOnBlur',
    'validationError',
    'serialize',
    'deserialize',
    'onFocus',
    'onBlur',
    'readOnly',
    'error',
    'ref'
  ]);

  // Internal state management (controlled/uncontrolled)
  const isControlled = () => local.value !== undefined;
  const [internalValue, setInternalValue] = createSignal(local.defaultValue ?? '');
  const _value = () => isControlled() ? local.value! : internalValue();

  const setValue = (val: string) => {
    if (!isControlled()) {
      setInternalValue(val);
    }
    local.onChange?.(val);
  };

  const [valid, setValid] = createSignal(validateJson(_value(), local.deserialize!));

  const handleFocus: JSX.FocusEventHandler<HTMLTextAreaElement, FocusEvent> = (e) => {
    const fn = local.onFocus;
    if (typeof fn === "function") {
      fn(e);
    }
    setValid(true);
  };

  const handleBlur: JSX.FocusEventHandler<HTMLTextAreaElement, FocusEvent> = (e) => {
    const fn = local.onBlur;
    if (typeof fn === "function") {
      fn(e);
    }

    const isValid = validateJson(e.currentTarget.value, local.deserialize!);
    if (
      local.formatOnBlur &&
      !local.readOnly &&
      isValid &&
      e.currentTarget.value.trim() !== ""
    ) {
      setValue(
        local.serialize!(
          local.deserialize!(e.currentTarget.value),
          null,
          2
        )
      );
    }
    setValid(isValid);
  };

  return (
    <Textarea
      value={_value()}
      onChange={event => setValue(event.currentTarget.value)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      ref={local.ref}
      readOnly={local.readOnly}
      {...others}
      auto-complete="off"
      __staticSelector="JsonInput"
      error={valid() ? local.error : local.validationError || true}
      data-monospace
    />
  );
});

JsonInput.classes = InputBase.classes;
JsonInput.displayName = '@mantine/core/JsonInput';
