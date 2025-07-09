import { createEffect, splitProps, JSX, createMemo } from 'solid-js';
import { useId, useUncontrolled } from '@mantine/hooks';
import {
  BoxProps,
  ElementProps,
  factory,
  Factory,
  StylesApiProps,
  useProps,
  useResolvedStylesApi,
} from '../../core';
import {
  Combobox,
  ComboboxLikeProps,
  ComboboxLikeRenderOptionInput,
  ComboboxLikeStylesNames,
  ComboboxStringData,
  ComboboxStringItem,
  getOptionsLockup,
  getParsedComboboxData,
  OptionsDropdown,
  useCombobox,
} from '../Combobox';
import {
  __BaseInputProps,
  __InputStylesNames,
  InputClearButtonProps,
  InputVariant,
} from '../Input';
import { InputBase } from '../InputBase';
import { ScrollAreaProps } from '../ScrollArea';

export type AutocompleteStylesNames = __InputStylesNames | ComboboxLikeStylesNames;

export interface AutocompleteProps
  extends BoxProps,
    __BaseInputProps,
    Omit<ComboboxLikeProps, 'data'>,
    StylesApiProps<AutocompleteFactory>,
    ElementProps<'input', 'onChange' | 'size'> {
  /** Data displayed in the dropdown. Values must be unique, otherwise an error will be thrown and component will not render. */
  data?: ComboboxStringData;

  /** Controlled component value */
  value?: string;

  /** Uncontrolled component default value */
  defaultValue?: string;

  /** Called when value changes */
  onChange?: (value: string) => void;

  /** A function to render content of the option, replaces the default content of the option */
  renderOption?: (input: ComboboxLikeRenderOptionInput<ComboboxStringItem>) => JSX.Element;

  /** Props passed down to the underlying `ScrollArea` component in the dropdown */
  scrollAreaProps?: ScrollAreaProps;

  /** Called when the clear button is clicked */
  onClear?: () => void;

  /** Props passed down to the clear button */
  clearButtonProps?: InputClearButtonProps & ElementProps<'button'>;

  /** Determines whether the clear button should be displayed in the right section when the component has value, `false` by default */
  clearable?: boolean;
}

export type AutocompleteFactory = Factory<{
  props: AutocompleteProps;
  ref: HTMLInputElement;
  stylesNames: AutocompleteStylesNames;
  variant: InputVariant;
}>;

const defaultProps: Partial<AutocompleteProps> = {};

export const Autocomplete = factory<AutocompleteFactory>(_props => {
  const props = useProps('Autocomplete', defaultProps, _props);
  const [local, others] = splitProps(props, [
    'classNames',
    'styles',
    'unstyled',
    'vars',
    'dropdownOpened',
    'defaultDropdownOpened',
    'onDropdownClose',
    'onDropdownOpen',
    'onFocus',
    'onBlur',
    'onClick',
    'onChange',
    'data',
    'value',
    'defaultValue',
    'selectFirstOptionOnChange',
    'onOptionSubmit',
    'comboboxProps',
    'readOnly',
    'disabled',
    'filter',
    'limit',
    'withScrollArea',
    'maxDropdownHeight',
    'size',
    'id',
    'renderOption',
    'autocomplete',
    'scrollAreaProps',
    'onClear',
    'clearButtonProps',
    'error',
    'clearable',
    'rightSection',
    'ref'
  ]);

  const _id = useId(local.id);
  const parsedData = createMemo(() => getParsedComboboxData(local.data));
  const optionsLockup = createMemo(() => getOptionsLockup(parsedData()));

  const [_value, setValue] = useUncontrolled({
    value: () => local.value,
    defaultValue: local.defaultValue!,
    finalValue: '',
    onChange: local.onChange,
  });

  const combobox = useCombobox({
    opened: () => local.dropdownOpened!,
    defaultOpened: local.defaultDropdownOpened,
    onDropdownOpen: local.onDropdownOpen,
    onDropdownClose: () => {
      local.onDropdownClose?.();
      combobox.resetSelectedOption();
    },
  });

  const handleValueChange = (value: string) => {
    setValue(value);
    combobox.resetSelectedOption();
  };

  const { resolvedClassNames, resolvedStyles } = useResolvedStylesApi<AutocompleteFactory>({
    props,
    styles: local.styles,
    classNames: local.classNames,
  });

  createEffect(() => {
    if (local.selectFirstOptionOnChange) {
      combobox.selectFirstOption();
    }
  });

  const clearButton = (
    <Combobox.ClearButton
      {...local.clearButtonProps}
      onClear={() => {
        handleValueChange('');
        local.onClear?.();
      }}
    />
  );

  return (
    <Combobox
      store={combobox}
      __staticSelector="Autocomplete"
      classNames={resolvedClassNames}
      styles={resolvedStyles}
      unstyled={local.unstyled}
      readOnly={local.readOnly}
      onOptionSubmit={(val: any) => {
        local.onOptionSubmit?.(val);
        handleValueChange(optionsLockup()[val].label);
        combobox.closeDropdown();
      }}
      size={local.size}
      {...local.comboboxProps}
    >
      <Combobox.Target autoComplete={local.autocomplete}>
        <InputBase
          ref={local.ref}
          {...others}
          size={local.size}
          __staticSelector="Autocomplete"
          __clearSection={clearButton}
          __clearable={local.clearable && !!_value() && !local.disabled && !local.readOnly}
          rightSection={local.rightSection}
          disabled={local.disabled}
          readOnly={local.readOnly}
          value={_value()}
          error={local.error}
          onInput={(event) => {
            handleValueChange(event.currentTarget.value);
            combobox.openDropdown();
            local.selectFirstOptionOnChange && combobox.selectFirstOption();
          }}
          onChange={(event) => {
            handleValueChange(_value() != null ? optionsLockup()[_value()]?.label || '' : '');
          }}
          onFocus={(event) => {
            combobox.openDropdown();
            typeof local.onFocus === 'function' && local.onFocus?.(event);
          }}
          onBlur={(event) => {
            combobox.closeDropdown();
            typeof local.onBlur === 'function' && local.onBlur?.(event);
          }}
          onClick={(event) => {
            combobox.openDropdown();
            typeof local.onClick === 'function' && local.onClick?.(event);
          }}
          classNames={resolvedClassNames}
          styles={resolvedStyles}
          unstyled={local.unstyled}
          id={_id}
        />
      </Combobox.Target>
      <OptionsDropdown
        data={parsedData()}
        hidden={local.readOnly || local.disabled}
        filter={local.filter}
        search={_value()}
        limit={local.limit}
        hiddenWhenEmpty
        withScrollArea={local.withScrollArea}
        maxDropdownHeight={local.maxDropdownHeight}
        unstyled={local.unstyled}
        labelId={others.label ? `${_id}-label` : undefined}
        aria-label={others.label ? undefined : others['aria-label']}
        renderOption={local.renderOption}
        scrollAreaProps={local.scrollAreaProps}
      />
    </Combobox>
  );
});

Autocomplete.classes = { ...InputBase.classes, ...Combobox.classes };
Autocomplete.displayName = '@mantine/core/Autocomplete';
