import {
  Box,
  BoxProps,
  createVarsResolver,
  getRadius,
  getSize,
  MantineColor,
  MantineGradient,
  MantineRadius,
  MantineSize,
  polymorphicFactory,
  PolymorphicFactory,
  StylesApiProps,
  useProps,
  useStyles,
} from '../../core';
import { Loader, LoaderProps } from '../Loader';
import { Transition } from '../Transition';
import { UnstyledButton } from '../UnstyledButton';
import { ActionIconGroup } from './ActionIconGroup/ActionIconGroup';
import { ActionIconGroupSection } from './ActionIconGroupSection/ActionIconGroupSection';
import classes from './ActionIcon.module.css';
import { JSX } from 'solid-js/jsx-runtime';
import { splitProps } from 'solid-js';

export type ActionIconVariant =
  | 'filled'
  | 'light'
  | 'outline'
  | 'transparent'
  | 'white'
  | 'subtle'
  | 'default'
  | 'gradient';

export type ActionIconStylesNames = 'root' | 'loader' | 'icon';
export type ActionIconCssVariables = {
  root:
    | '--ai-radius'
    | '--ai-size'
    | '--ai-bg'
    | '--ai-hover'
    | '--ai-hover-color'
    | '--ai-color'
    | '--ai-bd';
};

export interface ActionIconProps extends BoxProps, StylesApiProps<ActionIconFactory> {
  'data-disabled'?: boolean;
  __staticSelector?: string;

  /** Determines whether `Loader` component should be displayed instead of the `children`, `false` by default */
  loading?: boolean;

  /** Props added to the `Loader` component (only visible when `loading` prop is set) */
  loaderProps?: LoaderProps;

  /** Controls width and height of the button. Numbers are converted to rem. `'md'` by default. */
  size?: MantineSize | `input-${MantineSize}` | (string & {}) | number;

  /** Key of `theme.colors` or any valid CSS color. Default value is `theme.primaryColor`.  */
  color?: MantineColor;

  /** Key of `theme.radius` or any valid CSS value to set border-radius. Numbers are converted to rem. `theme.defaultRadius` by default. */
  radius?: MantineRadius;

  /** Gradient data used when `variant="gradient"`, default value is `theme.defaultGradient` */
  gradient?: MantineGradient;

  /** Sets `disabled` and `data-disabled` attributes on the button element */
  disabled?: boolean;

  /** Icon displayed inside the button */
  children?: JSX.Element;

  /** Determines whether button text color with filled variant should depend on `background-color`. If luminosity of the `color` prop is less than `theme.luminosityThreshold`, then `theme.white` will be used for text color, otherwise `theme.black`. Overrides `theme.autoContrast`. */
  autoContrast?: boolean;
}

export type ActionIconFactory = PolymorphicFactory<{
  props: ActionIconProps;
  defaultComponent: 'button';
  defaultRef: HTMLButtonElement;
  stylesNames: ActionIconStylesNames;
  variant: ActionIconVariant;
  vars: ActionIconCssVariables;
  staticComponents: {
    Group: typeof ActionIconGroup;
    GroupSection: typeof ActionIconGroupSection;
  };
}>;

const defaultProps: Partial<ActionIconProps> = {};

const varsResolver = createVarsResolver<ActionIconFactory>(
  (theme, { size, radius, variant, gradient, color, autoContrast }) => {
    const colors = theme.variantColorResolver({
      color: color || theme.primaryColor,
      theme,
      gradient,
      variant: variant || 'filled',
      autoContrast,
    });

    return {
      root: {
        '--ai-size': getSize(size, 'ai-size'),
        '--ai-radius': radius === undefined ? undefined : getRadius(radius),
        '--ai-bg': color || variant ? colors.background : undefined,
        '--ai-hover': color || variant ? colors.hover : undefined,
        '--ai-hover-color': color || variant ? colors.hoverColor : undefined,
        '--ai-color': colors.color,
        '--ai-bd': color || variant ? colors.border : undefined,
      },
    };
  }
);

export const ActionIcon = polymorphicFactory<ActionIconFactory>((_props, ref) => {
  const props = useProps('ActionIcon', defaultProps, _props);
  const [local, others] = splitProps(props, [
    'className',
    'unstyled',
    'variant',
    'classNames',
    'styles',
    'style',
    'loading',
    'loaderProps',
    'size',
    'color',
    'radius',
    '__staticSelector',
    'gradient',
    'vars',
    'children',
    'disabled',
    'data-disabled',
    'autoContrast',
    'mod',
  ]);

  const getStyles = useStyles<ActionIconFactory>({
    name: ['ActionIcon', local.__staticSelector],
    props,
    className: local.className,
    style: local.style,
    classes,
    classNames: local.classNames,
    styles: local.styles,
    unstyled: local.unstyled,
    vars: local.vars,
    varsResolver,
  });

  return (
    <UnstyledButton
      {...getStyles('root', { active: !local.disabled && !local.loading && !local["data-disabled"] })}
      {...others}
      unstyled={local.unstyled}
      variant={local.variant}
      size={local.size}
      disabled={local.disabled || local.loading}
      ref={ref}
      mod={[{ loading: local.loading, disabled: local.disabled || local["data-disabled"] }, local.mod]}
    >
      <Transition mounted={!!local.loading} transition="slide-down" duration={150}>
        {(transitionStyles) => (
          <Box component="span" {...getStyles('loader', { style: transitionStyles })} aria-hidden>
            <Loader color="var(--ai-color)" size="calc(var(--ai-size) * 0.55)" {...local.loaderProps} />
          </Box>
        )}
      </Transition>

      <Box component="span" mod={{ loading: local.loading }} {...getStyles('icon')}>
        {local.children}
      </Box>
    </UnstyledButton>
  );
});

ActionIcon.classes = classes;
ActionIcon.displayName = '@mantine/core/ActionIcon';
ActionIcon.Group = ActionIconGroup;
ActionIcon.GroupSection = ActionIconGroupSection;
