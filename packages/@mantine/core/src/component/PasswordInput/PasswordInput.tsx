import cx from 'clsx';
import { useId, useUncontrolled } from '@mantine/hooks';
import {
  BoxProps,
  createVarsResolver,
  ElementProps,
  extractStyleProps,
  factory,
  Factory,
  getSize,
  StylesApiProps,
  useProps,
  useResolvedStylesApi,
  useStyles,
} from '../../core';
import { ActionIcon } from '../ActionIcon';
import { __BaseInputProps, __InputStylesNames, Input, InputVariant } from '../Input';
import { InputBase } from '../InputBase';
import { PasswordToggleIcon } from './PasswordToggleIcon';
import classes from './PasswordInput.module.css';
import { Component, splitProps } from 'solid-js';

export type PasswordInputStylesNames =
  | 'root'
  | 'visibilityToggle'
  | 'innerInput'
  | __InputStylesNames;
export type PasswordInputCssVariables = {
  root: '--psi-icon-size' | '--psi-button-size';
};

export interface PasswordInputProps
  extends BoxProps,
    __BaseInputProps,
    StylesApiProps<PasswordInputFactory>,
    ElementProps<'input', 'size'> {
  /** A component to replace visibility toggle icon */
  visibilityToggleIcon?: Component<{ reveal: boolean }>;

  /** Props passed down to the visibility toggle button */
  visibilityToggleButtonProps?: Record<string, any>;

  /** Determines whether input content should be visible */
  visible?: boolean;

  /** Determines whether input content should be visible by default */
  defaultVisible?: boolean;

  /** Called when visibility changes */
  onVisibilityChange?: (visible: boolean) => void;
}

export type PasswordInputFactory = Factory<{
  props: PasswordInputProps;
  ref: HTMLInputElement;
  stylesNames: PasswordInputStylesNames;
  vars: PasswordInputCssVariables;
  variant: InputVariant;
}>;

const defaultProps: Partial<PasswordInputProps> = {
  visibilityToggleIcon: PasswordToggleIcon,
};

const varsResolver = createVarsResolver<PasswordInputFactory>((_, { size }) => ({
  root: {
    '--psi-icon-size': getSize(size, 'psi-icon-size'),
    '--psi-button-size': getSize(size, 'psi-button-size'),
  },
}));

export const PasswordInput = factory<PasswordInputFactory>((_props, ref) => {
  const props = useProps('PasswordInput', defaultProps, _props);
  const [local, others] = splitProps(props, [
    'classNames',
    'className',
    'style',
    'styles',
    'unstyled',
    'vars',
    'required',
    'error',
    'leftSection',
    'disabled',
    'id',
    'variant',
    'inputContainer',
    'description',
    'label',
    'size',
    'errorProps',
    'descriptionProps',
    'labelProps',
    'withAsterisk',
    'inputWrapperOrder',
    'wrapperProps',
    'radius',
    'rightSection',
    'rightSectionWidth',
    'rightSectionPointerEvents',
    'leftSectionWidth',
    'visible',
    'defaultVisible',
    'onVisibilityChange',
    'visibilityToggleIcon',
    'visibilityToggleButtonProps',
    'rightSectionProps',
    'leftSectionProps',
    'leftSectionPointerEvents',
    'withErrorStyles',
    'mod',
    'ref'
  ]);

  const uuid = useId(local.id);

  const [_visible, setVisibility] = useUncontrolled({
    value: local.visible,
    defaultValue: local.defaultVisible,
    finalValue: false,
    onChange: local.onVisibilityChange,
  });

  const toggleVisibility = () => setVisibility(!_visible);

  const getStyles = useStyles<PasswordInputFactory>({
    name: 'PasswordInput',
    classes,
    props,
    className: local.className,
    style: local.style,
    classNames: local.classNames,
    styles: local.styles,
    unstyled: local.unstyled,
    vars: local.vars,
    varsResolver,
  });

  const { resolvedClassNames, resolvedStyles } = useResolvedStylesApi<PasswordInputFactory>({
    classNames: local.classNames,
    styles: local.styles,
    props,
  });

  const { styleProps, rest } = extractStyleProps(others);
  const VisibilityToggleIcon = local.visibilityToggleIcon!;

  const visibilityToggleButton = (
    <ActionIcon<'button'>
      {...getStyles('visibilityToggle')}
      disabled={local.disabled}
      radius={local.radius}
      aria-hidden={!local.visibilityToggleButtonProps}
      tabIndex={-1}
      {...local.visibilityToggleButtonProps}
      variant={local.visibilityToggleButtonProps?.variant ?? 'subtle'}
      color="gray"
      unstyled={local.unstyled}
      onTouchEnd={(event) => {
        event.preventDefault();
        local.visibilityToggleButtonProps?.onTouchEnd?.(event);
        toggleVisibility();
      }}
      onMouseDown={(event) => {
        event.preventDefault();
        local.visibilityToggleButtonProps?.onMouseDown?.(event);
        toggleVisibility();
      }}
      onKeyDown={(event) => {
        local.visibilityToggleButtonProps?.onKeyDown?.(event);
        if (event.key === ' ') {
          event.preventDefault();
          toggleVisibility();
        }
      }}
    >
      <VisibilityToggleIcon reveal={_visible()} />
    </ActionIcon>
  );

  return (
    <Input.Wrapper
      required={local.required}
      id={uuid}
      label={local.label}
      error={local.error}
      description={local.description}
      size={local.size}
      classNames={resolvedClassNames}
      styles={resolvedStyles}
      __staticSelector="PasswordInput"
      errorProps={local.errorProps}
      descriptionProps={local.descriptionProps}
      unstyled={local.unstyled}
      withAsterisk={local.withAsterisk}
      inputWrapperOrder={local.inputWrapperOrder}
      inputContainer={local.inputContainer}
      variant={local.variant}
      labelProps={{ ...local.labelProps, htmlFor: uuid }}
      mod={local.mod}
      {...getStyles('root')}
      {...styleProps}
      {...local.wrapperProps}
    >
      <Input<'div'>
        component="div"
        error={local.error}
        leftSection={local.leftSection}
        size={local.size}
        classNames={{ ...resolvedClassNames, input: cx(classes.input, resolvedClassNames.input) }}
        styles={resolvedStyles}
        radius={local.radius}
        disabled={local.disabled}
        __staticSelector="PasswordInput"
        rightSectionWidth={local.rightSectionWidth}
        rightSection={local.rightSection ?? visibilityToggleButton}
        variant={local.variant}
        unstyled={local.unstyled}
        leftSectionWidth={local.leftSectionWidth}
        rightSectionPointerEvents={local.rightSectionPointerEvents || 'all'}
        rightSectionProps={local.rightSectionProps}
        leftSectionProps={local.leftSectionProps}
        leftSectionPointerEvents={local.leftSectionPointerEvents}
        withAria={false}
        withErrorStyles={local.withErrorStyles}
      >
        <input
          required={local.required}
          data-invalid={!!local.error || undefined}
          data-with-left-section={!!local.leftSection || undefined}
          {...getStyles('innerInput')}
          disabled={local.disabled}
          id={uuid}
          ref={ref}
          {...rest}
          auto-complete={rest.autocomplete || 'off'}
          type={_visible() ? 'text' : 'password'}
        />
      </Input>
    </Input.Wrapper>
  );
});

PasswordInput.classes = { ...InputBase.classes, ...classes };
PasswordInput.displayName = '@mantine/core/PasswordInput';
