import { children, splitProps, JSX, createSignal, lazy, createEffect, Show } from 'solid-js';
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

export const Card = polymorphicFactory<CardFactory>((_props, ref) => {
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

  const resolved = children(() => local.children);

  const content = () => {
    const c = resolved.toArray().filter((item) => !!item);

    return c.map((node, index) => {
      const isSection = (node as any)?.dataset?.cardSection === 'true';
      if (!isSection) return node;

      const clone = (node as any).cloneNode(true);
      const sectionClasses = getStyles('section').className;
      const sectionStyles = getStyles('section').style;

      clone.removeAttribute('data-card-section');
      clone.setAttribute('class', sectionClasses);
      if (index === 0) clone.setAttribute('data-first-section', 'true');
      if (index === c.length - 1) clone.setAttribute('data-last-section', 'true');

      Object.entries(sectionStyles).forEach(([prop, value]) => {
        const cssProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
        (clone as HTMLElement).style.setProperty(cssProp, value);
      });

      return clone;
    });
  };

  // createEffect(() => {
  //   setCardStylesStore({ getStyles });
  // });

  return (
    <CardProvider value={{ getStyles }}>
      <Paper ref={ref} unstyled={local.unstyled} {...getStyles('root')} {...others}>
        {content()}
      </Paper>
    </CardProvider>
  );
});

Card.classes = classes;
Card.displayName = '@mantine/core/Card';
Card.Section = CardSection;
