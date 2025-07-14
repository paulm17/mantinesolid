const originalWarn = console.warn;
  console.warn = (message, ...args) => {
    if (typeof message === 'string' && message.includes('computations created outside a `createRoot` or `render` will never be disposed')) {
      return;
    }
    originalWarn(message, ...args);
  };

import { splitProps, JSX } from 'solid-js';
import {
  Box,
  BoxProps,
  createVarsResolver,
  getDefaultZIndex,
  getRadius,
  MantineRadius,
  polymorphicFactory,
  PolymorphicFactory,
  rem,
  rgba,
  StylesApiProps,
  useProps,
  useStyles,
} from '../../core';
import classes from './Overlay.module.css';

export type OverlayStylesNames = 'root';
export type OverlayCssVariables = {
  root: '--overlay-bg' | '--overlay-filter' | '--overlay-radius' | '--overlay-z-index';
};

export interface OverlayProps extends BoxProps, StylesApiProps<OverlayFactory> {
  /** Controls overlay `background-color` opacity 0–1, disregarded when `gradient` prop is set, `0.6` by default */
  backgroundOpacity?: number;

  /** Overlay `background-color`, `#000` by default */
  color?: JSX.CSSProperties['background-color'];

  /** Overlay background blur, `0` by default */
  blur?: number | string;

  /** Changes overlay to gradient. If set, `color` prop is ignored */
  gradient?: string;

  /** Overlay z-index, `200` by default */
  zIndex?: string | number;

  /** Key of `theme.radius` or any valid CSS value to set border-radius, `0` by default */
  radius?: MantineRadius;

  /** Content inside overlay */
  children?: JSX.Element;

  /** Determines whether content inside overlay should be vertically and horizontally centered, `false` by default */
  center?: boolean;

  /** Determines whether overlay should have fixed position instead of absolute, `false` by default */
  fixed?: boolean;
}

export type OverlayFactory = PolymorphicFactory<{
  props: OverlayProps;
  defaultRef: HTMLDivElement;
  defaultComponent: 'div';
  stylesNames: OverlayStylesNames;
  vars: OverlayCssVariables;
}>;

const defaultProps: Partial<OverlayProps> = {
  zIndex: getDefaultZIndex('modal'),
};

const varsResolver = createVarsResolver<OverlayFactory>(
  (_, { gradient, color, backgroundOpacity, blur, radius, zIndex }) => ({
    root: {
      '--overlay-bg':
        gradient ||
        ((color !== undefined || backgroundOpacity !== undefined) &&
          rgba(color || '#000', backgroundOpacity ?? 0.6)) ||
        undefined,
      '--overlay-filter': blur ? `blur(${rem(blur)})` : undefined,
      '--overlay-radius': radius === undefined ? undefined : getRadius(radius),
      '--overlay-z-index': zIndex?.toString(),
    },
  })
);

export const Overlay = polymorphicFactory<OverlayFactory>(_props => {
  const props = useProps('Overlay', defaultProps, _props);
  const [local, others] = splitProps(props, [
    'classNames',
    'className',
    'style',
    'styles',
    'unstyled',
    'vars',
    'fixed',
    'center',
    'children',
    'radius',
    'zIndex',
    'gradient',
    'blur',
    'color',
    'backgroundOpacity',
    'mod',
    'ref'
  ]);

  const getStyles = useStyles<OverlayFactory>({
    name: 'Overlay',
    props,
    classes,
    className: local.className,
    style: local.style,
    classNames: local.classNames,
    styles: local.styles,
    unstyled: local.unstyled,
    vars: local.vars,
    varsResolver,
  });

  return (
    <Box ref={local.ref} {...getStyles('root')} mod={[{ center: local.center, fixed: local.fixed }, local.mod]} {...others}>
      {local.children}
    </Box>
  );
});

Overlay.classes = classes;
Overlay.displayName = '@mantine/core/Overlay';
