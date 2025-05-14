import { splitProps } from 'solid-js';
import {
  Box,
  BoxProps,
  CompoundStylesApiProps,
  polymorphicFactory,
  PolymorphicFactory,
  useProps,
} from '../../../core';
import classes from '../Card.module.css';
import { cardStylesStore } from '../Card.store';

export type CardSectionStylesNames = 'section';

export interface CardSectionProps extends BoxProps, CompoundStylesApiProps<CardSectionFactory> {
  /** Determines whether the section should have a border, `false` by default */
  withBorder?: boolean;

  /** Determines whether the section should inherit padding from the parent `Card`, `false` by default */
  inheritPadding?: boolean;
}

export type CardSectionFactory = PolymorphicFactory<{
  props: CardSectionProps;
  defaultRef: HTMLDivElement;
  defaultComponent: 'div';
  stylesNames: CardSectionStylesNames;
  compound: true;
}>;

const defaultProps: Partial<CardSectionProps> = {};

export const CardSection = polymorphicFactory<CardSectionFactory>((_props, ref) => {
  const props = useProps('CardSection', defaultProps, _props);
  const [local, others] = splitProps(props, [
    'classNames',
    'className',
    'style',
    'styles',
    'vars',
    'withBorder',
    'inheritPadding',
    'mod',
  ]);

  const styles = cardStylesStore.getStyles('section', {
    className: local.className,
    style: local.style,
    classNames: local.classNames,
    styles: local.styles,
  });

  return (
    <Box
      ref={ref}
      mod={[{ 'with-border': local.withBorder, 'inherit-padding': local.inheritPadding, 'card-section': true }, local.mod]}
      {...styles}
      {...others}
    />
  );
});

CardSection.classes = classes;
CardSection.displayName = '@mantine/core/CardSection';
