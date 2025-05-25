import { children, splitProps, JSX, createEffect, createSignal } from 'solid-js';
import {
  BoxProps,
  createVarsResolver,
  getSpacing,
  MantineRadius,
  MantineShadow,
  MantineSpacing,
  polymorphicFactory,
  PolymorphicFactory,
  StylesApiProps,
  useProps,
  useStyles,
} from '../../core';
import { Paper } from '../Paper';
import { CardSection } from './CardSection/CardSection';
import classes from './Card.module.css';
import { CardProvider } from './Card.context';

export type CardStylesNames = 'root' | 'section';
export type CardCssVariables = {
  root: '--card-padding';
};

export interface CardProps extends BoxProps, StylesApiProps<CardFactory> {
  /** Key of `theme.shadows` or any valid CSS value to set `box-shadow`, `none` by default */
  shadow?: MantineShadow;

  /** Key of `theme.radius` or any valid CSS value to set border-radius, numbers are converted to rem, `theme.defaultRadius` by default */
  radius?: MantineRadius;

  /** Determines whether the card should have border, border color depends on color scheme, `false` by default */
  withBorder?: boolean;

  /** Controls `padding`, key of `theme.spacing` or any valid CSS value, `'md'` by default */
  padding?: MantineSpacing;

  /** Card content */
  children?: JSX.Element;
}

export type CardFactory = PolymorphicFactory<{
  props: CardProps;
  defaultRef: HTMLDivElement;
  defaultComponent: 'div';
  stylesNames: CardStylesNames;
  vars: CardCssVariables;
  staticComponents: {
    Section: typeof CardSection;
  };
}>;

const defaultProps: Partial<CardProps> = {};

const varsResolver = createVarsResolver<CardFactory>((_, { padding }) => ({
  root: {
    '--card-padding': getSpacing(padding),
  },
}));

export const Card = polymorphicFactory<CardFactory>(_props => {
  const props = useProps('Card', defaultProps, _props);
  const [local, others] = splitProps(props, [
    'classNames',
    'className',
    'style',
    'styles',
    'unstyled',
    'vars',
    'children',
    'padding',
    'mod',
    'ref'
  ]);

  const getStyles = useStyles<CardFactory>({
    name: 'Card',
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

  const [count, setCount] = createSignal(0);

  function registerItem() {
    const idx = count();
    setCount(idx + 1);
    return idx;
  }

  function totalItems() {
    return count();
  }

  return (
    <CardProvider value={{
      getStyles,
      registerItem,
      totalItems,
     }}>
      <Paper ref={local.ref} unstyled={local.unstyled} {...getStyles('root')} {...others}>
        {local.children}
      </Paper>
    </CardProvider>
  );
});

Card.classes = classes;
Card.displayName = '@mantine/core/Card';
Card.Section = CardSection;
