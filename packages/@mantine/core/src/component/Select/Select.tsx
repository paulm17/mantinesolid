import { useId, usePrevious, useUncontrolled } from '@mantine/hooks';
import {
  BoxProps,
  ElementProps,
  Factory,
  factory,
  MantineColor,
  StylesApiProps,
  useProps,
  useResolvedStylesApi,
} from '../../core';
import {
  Combobox,
  ComboboxItem,
  ComboboxLikeProps,
  ComboboxLikeRenderOptionInput,
  ComboboxLikeStylesNames,
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
import { ComponentProps, createEffect, createMemo, JSX, splitProps } from 'solid-js';

export type SelectStylesNames = __InputStylesNames | ComboboxLikeStylesNames;

export interface SelectProps
  extends BoxProps,
    __BaseInputProps,
    ComboboxLikeProps,
    StylesApiProps<SelectFactory>,
    ElementProps<'input', 'onChange' | 'size' | 'value' | 'defaultValue'> {
  /** Controlled component value */
  value?: string | null;

  /** Uncontrolled component default value */
  defaultValue?: string | null;

  /** Called when value changes */
  onChange?: (value: string | null, option: ComboboxItem) => void;

  /** Called when the clear button is clicked */
  onClear?: () => void;

  /** Determines whether the select should be searchable, `false` by default */
  searchable?: boolean;

  /** Determines whether check icon should be displayed near the selected option label, `true` by default */
  withCheckIcon?: boolean;

  /** Position of the check icon relative to the option label, `'left'` by default */
  checkIconPosition?: 'left' | 'right';

  /** Message displayed when no option matches the current search query while the `searchable` prop is set or there is no data */
  nothingFoundMessage?: JSX.Element;

  /** Controlled search value */
  searchValue?: string;

  /** Default search value */
  defaultSearchValue?: string;

  /** Called when search changes */
  onSearchChange?: (value: string) => void;

  /** Determines whether it should be possible to deselect value by clicking on the selected option, `true` by default */
  allowDeselect?: boolean;

  /** Determines whether the clear button should be displayed in the right section when the component has value, `false` by default */
  clearable?: boolean;

  /** Props passed down to the clear button */
  clearButtonProps?: InputClearButtonProps & ElementProps<'button'>;

  /** Props passed down to the hidden input */
  hiddenInputProps?: Omit<ComponentProps<'input'>, 'value'>;

  /** A function to render content of the option, replaces the default content of the option */
  renderOption?: (item: ComboboxLikeRenderOptionInput<ComboboxItem>) => JSX.Element;

  /** Props passed down to the underlying `ScrollArea` component in the dropdown */
  scrollAreaProps?: ScrollAreaProps;

  /** Controls color of the default chevron, by default depends on the color scheme */
  chevronColor?: MantineColor;
}

export type SelectFactory = Factory<{
  props: SelectProps;
  ref: HTMLInputElement;
  stylesNames: SelectStylesNames;
  variant: InputVariant;
}>;

const defaultProps: Partial<SelectProps> = {
  searchable: false,
  withCheckIcon: true,
  allowDeselect: true,
  checkIconPosition: 'left',
};

export const Select = factory<SelectFactory>(_props => {
  const props = useProps('Select', defaultProps, _props);
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
    'searchable',
    'rightSection',
    'checkIconPosition',
    'withCheckIcon',
    'nothingFoundMessage',
    'name',
    'form',
    'searchValue',
    'defaultSearchValue',
    'onSearchChange',
    'allowDeselect',
    'error',
    'rightSectionPointerEvents',
    'id',
    'clearable',
    'clearButtonProps',
    'hiddenInputProps',
    'renderOption',
    'onClear',
    'autocomplete',
    'scrollAreaProps',
    '__defaultRightSection',
    '__clearSection',
    '__clearable',
    'chevronColor',
    'ref'
  ]);

  const parsedData = createMemo(() => getParsedComboboxData(local.data));
  const optionsLockup = createMemo(() => getOptionsLockup(parsedData()));
  const _id = useId(local.id);

  const [_value, setValue, controlled] = useUncontrolled({
    value: () => local.value,
    defaultValue: local.defaultValue!,
    finalValue: null,
    onChange: local.onChange,
  });

  const selectedOption = createMemo(() => {
    const v = _value();
    return typeof v === 'string' ? optionsLockup()[v] : undefined;
  });
  const previousSelectedOption = usePrevious(selectedOption);

  const [search, setSearch] = useUncontrolled({
    value: () => local.searchValue,
    defaultValue: local.defaultSearchValue!,
    finalValue: selectedOption() ? selectedOption()!.label : '',
    onChange: local.onSearchChange,
  });

  const combobox = useCombobox({
    opened: () => local.dropdownOpened!,
    defaultOpened: local.defaultDropdownOpened,
    onDropdownOpen: () => {
      local.onDropdownOpen?.();
      combobox.updateSelectedOptionIndex('active', { scrollIntoView: true });
    },
    onDropdownClose: () => {
      local.onDropdownClose?.();
      combobox.resetSelectedOption();
    },
  });

  const handleSearchChange = (value: string) => {
    setSearch(value);
    combobox.resetSelectedOption();
  };

  const { resolvedClassNames, resolvedStyles } = useResolvedStylesApi<SelectFactory>({
    props,
    styles: local.styles,
    classNames: local.classNames,
  });

  createEffect(() => {
    if (local.selectFirstOptionOnChange) {
      combobox.selectFirstOption();
    }
  });

  createEffect(() => {
    if (local.selectFirstOptionOnChange) {
      combobox.selectFirstOption();
    }
  });

  createEffect(() => {
    if (local.value === null) {
      handleSearchChange('');
    }

    const currentOption = selectedOption();

    if (
      typeof local.value === 'string' &&
      // Check the value 'currentOption' instead of the function 'selectedOption'
      currentOption &&
      (previousSelectedOption()?.value !== currentOption.value ||
        previousSelectedOption()?.label !== currentOption.label)
    ) {
      // This is now type-safe
      handleSearchChange(currentOption.label);
    }
  });

  createEffect(() => {
    const currentOption = selectedOption();
    if (typeof local.value === 'string' && currentOption) {
      handleSearchChange(currentOption.label);
    }
  });

  const clearButton = (
    <Combobox.ClearButton
      {...local.clearButtonProps}
      onClear={() => {
        setValue(null, null);
        handleSearchChange('');
        local.onClear?.();
      }}
    />
  );

  const _clearable = local.clearable && !!_value() && !local.disabled && !local.readOnly;

  return (
    <>
      <Combobox
        store={combobox}
        __staticSelector="Select"
        classNames={resolvedClassNames}
        styles={resolvedStyles}
        unstyled={local.unstyled}
        readOnly={local.readOnly}
        onOptionSubmit={(val) => {
          local.onOptionSubmit?.(val);
          const optionLockup = local.allowDeselect
            ? optionsLockup()[val].value === _value()
              ? null
              : optionsLockup()[val]
            : optionsLockup()[val];

          const nextValue = optionLockup ? optionLockup.value : null;

          nextValue !== _value() && setValue(nextValue, optionLockup);
          !controlled &&
            handleSearchChange(typeof nextValue === 'string' ? optionLockup?.label || '' : '');
          combobox.closeDropdown();
        }}
        size={local.size}
        {...local.comboboxProps}
      >
        <Combobox.Target targetType={local.searchable ? 'input' : 'button'} autoComplete={local.autocomplete}>
          <InputBase
            id={_id}
            ref={local.ref}
            __defaultRightSection={
              <Combobox.Chevron
                size={local.size}
                error={local.error}
                unstyled={local.unstyled}
                color={local.chevronColor}
              />
            }
            __clearSection={clearButton}
            __clearable={_clearable}
            rightSection={local.rightSection}
            rightSectionPointerEvents={local.rightSectionPointerEvents || (_clearable ? 'all' : 'none')}
            {...others}
            size={local.size}
            __staticSelector="Select"
            disabled={local.disabled}
            readOnly={local.readOnly || !local.searchable}
            value={search()}
            onInput={(event) => {
              handleSearchChange(event.currentTarget.value);
              combobox.openDropdown();
              local.selectFirstOptionOnChange && combobox.selectFirstOption();
            }}
            onChange={(event) => {
              handleSearchChange(_value() != null ? optionsLockup()[_value()!]?.label || '' : '');
            }}
            onFocus={(event) => {
              local.searchable && combobox.openDropdown();
              typeof local.onFocus === "function" && local.onFocus?.(event);
            }}
            onBlur={(event) => {
              local.searchable && combobox.closeDropdown();
              handleSearchChange(_value() != null ? optionsLockup()[_value()!]?.label || '' : '');
              typeof local.onBlur === "function" &&  local.onBlur?.(event);
            }}
            onClick={(event) => {
              local.searchable ? combobox.openDropdown() : combobox.toggleDropdown();
              typeof local.onClick === "function" &&  local.onClick?.(event);
            }}
            classNames={resolvedClassNames}
            styles={resolvedStyles}
            unstyled={local.unstyled}
            pointer={!local.searchable}
            error={local.error}
          />
        </Combobox.Target>
        <OptionsDropdown
          data={parsedData()}
          hidden={local.readOnly || local.disabled}
          filter={local.filter}
          search={search()}
          limit={local.limit}
          hiddenWhenEmpty={!local.nothingFoundMessage}
          withScrollArea={local.withScrollArea}
          maxDropdownHeight={local.maxDropdownHeight}
          filterOptions={local.searchable && selectedOption()?.label !== search()}
          value={_value()}
          checkIconPosition={local.checkIconPosition}
          withCheckIcon={local.withCheckIcon}
          nothingFoundMessage={local.nothingFoundMessage}
          unstyled={local.unstyled}
          labelId={others.label ? `${_id}-label` : undefined}
          aria-label={others.label ? undefined : others['aria-label']}
          renderOption={local.renderOption}
          scrollAreaProps={local.scrollAreaProps}
        />
      </Combobox>
      <Combobox.HiddenInput
        value={_value()}
        name={local.name}
        form={local.form}
        disabled={local.disabled}
        {...local.hiddenInputProps}
      />
    </>
  );
});

Select.classes = { ...InputBase.classes, ...Combobox.classes };
Select.displayName = '@mantine/core/Select';
