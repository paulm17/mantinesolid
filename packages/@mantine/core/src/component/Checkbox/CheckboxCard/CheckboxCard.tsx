import { createEffect, createSignal, splitProps } from 'solid-js';
import {
  BoxProps,
  createVarsResolver,
  ElementProps,
  factory,
  Factory,
  getRadius,
  MantineRadius,
  StylesApiProps,
  useProps,
  useStyles,
} from '../../../core';
import { UnstyledButton } from '../../UnstyledButton';
import { useCheckboxGroupContext } from '../CheckboxGroup.context';
import { CheckboxCardProvider } from './CheckboxCard.context';
import classes from './CheckboxCard.module.css';

export type CheckboxCardStylesNames = 'card';
export type CheckboxCardCssVariables = {
  card: '--card-radius';
};

export interface CheckboxCardProps
  extends BoxProps,
    StylesApiProps<CheckboxCardFactory>,
    ElementProps<'button', 'onChange'> {
  /** Controlled component value */
  checked?: boolean;

  /** Uncontrolled component default value */
  defaultChecked?: boolean;

  /** Called when value changes */
  onChange?: (checked: boolean) => void;

  /** Determines whether the card should have border, `true` by default */
  withBorder?: boolean;

  /** Key of `theme.radius` or any valid CSS value to set `border-radius`, numbers are converted to rem, `theme.defaultRadius` by default */
  radius?: MantineRadius;

  /** Value of the checkbox, used with `Checkbox.Group` */
  value?: string;
}

export type CheckboxCardFactory = Factory<{
  props: CheckboxCardProps;
  ref: HTMLButtonElement;
  stylesNames: CheckboxCardStylesNames;
  vars: CheckboxCardCssVariables;
}>;

const defaultProps: Partial<CheckboxCardProps> = {
  withBorder: true,
};

const varsResolver = createVarsResolver<CheckboxCardFactory>((_, { radius }) => ({
  card: {
    '--card-radius': getRadius(radius),
  },
}));

export const CheckboxCard = factory<CheckboxCardFactory>((props, ref) => {
  const [local, others] = splitProps(
    useProps('CheckboxCard', defaultProps, props),
    [
      'classNames',
      'className',
      'style',
      'styles',
      'unstyled',
      'vars',
      'checked',
      'mod',
      'withBorder',
      'value',
      'onClick',
      'defaultChecked',
      'onChange',
      'ref'
    ]
  );

  const getStyles = useStyles<CheckboxCardFactory>({
    name: 'CheckboxCard',
    classes,
    props,
    className: local.className,
    style: local.style,
    classNames: local.classNames,
    styles: local.styles,
    unstyled: local.unstyled,
    vars: local.vars,
    varsResolver,
    rootSelector: 'card',
  });

  const ctx = useCheckboxGroupContext();
  const initialChecked = typeof local.checked === 'boolean'
    ? local.checked
    : ctx ? ctx.value.includes(local.value || '') : undefined;

  const [checked, setChecked] = createSignal(
    initialChecked !== undefined ? initialChecked : local.defaultChecked || false
  );

  // Update internal value when controlled value changes
  createEffect(() => {
    if (local.checked !== undefined) {
      setChecked(local.checked);
    } else if (ctx && local.value) {
      setChecked(ctx.value.includes(local.value));
    }
  });

  const handleClick = (event: MouseEvent & { currentTarget: HTMLButtonElement; target: Element }) => {
    if (typeof local.onClick === 'function') {
      local.onClick(event);
    }

    if (ctx && local.value) {
      ctx.onChange(local.value);
    }

    const newValue = !checked();
    setChecked(newValue);
    local.onChange?.(newValue);
  };

  return (
    <CheckboxCardProvider value={{ checked: checked() }}>
      <UnstyledButton
        ref={ref}
        mod={[{ 'with-border': local.withBorder, checked: checked() }, local.mod]}
        {...getStyles('card')}
        {...others}
        role="checkbox"
        aria-checked={checked()}
        onClick={handleClick}
      />
    </CheckboxCardProvider>
  );
});

CheckboxCard.displayName = '@mantine/core/CheckboxCard';
CheckboxCard.classes = classes;
