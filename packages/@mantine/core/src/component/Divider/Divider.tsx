import { JSX } from 'solid-js/jsx-runtime';
import {
  Box,
  BoxProps,
  createVarsResolver,
  ElementProps,
  factory,
  Factory,
  getSize,
  getThemeColor,
  MantineColor,
  MantineSize,
  StylesApiProps,
  useProps,
  useStyles,
} from '../../core';
import classes from './Divider.module.css';
import { splitProps } from 'solid-js';

export type DividerStylesNames = 'root' | 'label';
export type DividerVariant = 'solid' | 'dashed' | 'dotted';
export type DividerCssVariables = {
  root: '--divider-color' | '--divider-border-style' | '--divider-size';
};

export interface DividerProps
  extends BoxProps,
    StylesApiProps<DividerFactory>,
    ElementProps<'div'> {
  /** Key of `theme.colors` or any valid CSS color value, by default value depends on color scheme */
  color?: MantineColor;

  /** Controls width/height (depends on orientation), `'xs'` by default */
  size?: MantineSize | number | (string & {});

  /** Divider label, visible only when `orientation` is `horizontal` */
  label?: JSX.Element;

  /** Controls label position, `'center'` by default */
  labelPosition?: 'left' | 'center' | 'right';

  /** Controls orientation, `'horizontal'` by default */
  orientation?: 'horizontal' | 'vertical';
}

export type DividerFactory = Factory<{
  props: DividerProps;
  ref: HTMLDivElement;
  stylesNames: DividerStylesNames;
  vars: DividerCssVariables;
  variant: DividerVariant;
}>;

const defaultProps: Partial<DividerProps> = {
  orientation: 'horizontal',
};

const varsResolver = createVarsResolver<DividerFactory>((theme, { color, variant, size }) => ({
  root: {
    '--divider-color': color ? getThemeColor(color, theme) : undefined,
    '--divider-border-style': variant,
    '--divider-size': getSize(size, 'divider-size'),
  },
}));

export const Divider = factory<DividerFactory>((_props, ref) => {
  const props = useProps('Divider', defaultProps, _props);
  const [local, others] = splitProps(props, [
    'classNames',
    'className',
    'style',
    'styles',
    'unstyled',
    'vars',
    'color',
    'orientation',
    'label',
    'labelPosition',
    'mod',
    'ref'
  ]);

  const getStyles = useStyles<DividerFactory>({
    name: 'Divider',
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

  return (
    <Box
      ref={ref}
      mod={[{ orientation, 'with-label': !!local.label }, local.mod]}
      {...getStyles('root')}
      {...others}
      role="separator"
    >
      {local.label && (
        <Box component="span" mod={{ position: local.labelPosition }} {...getStyles('label')}>
          {local.label}
        </Box>
      )}
    </Box>
  );
});

Divider.classes = classes;
Divider.displayName = '@mantine/core/Divider';
