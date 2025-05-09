import { splitProps } from 'solid-js';
import {
  Box,
  BoxProps,
  ElementProps,
  factory,
  Factory,
  StylesApiProps,
  useProps,
  useStyles,
} from '../../core';
import classes from './TypographyStylesProvider.module.css';

export type TypographyStylesProviderStylesNames = 'root';

export interface TypographyStylesProviderProps
  extends BoxProps,
    StylesApiProps<TypographyStylesProviderFactory>,
    ElementProps<'div'> {}

export type TypographyStylesProviderFactory = Factory<{
  props: TypographyStylesProviderProps;
  ref: HTMLDivElement;
  stylesNames: TypographyStylesProviderStylesNames;
}>;

const defaultProps: Partial<TypographyStylesProviderProps> = {};

export const TypographyStylesProvider = factory<TypographyStylesProviderFactory>((_props, ref) => {
  const props = useProps('TypographyStylesProvider', defaultProps, _props);
  const [local, others] = splitProps(props, [
    'classNames',
    'className',
    'style',
    'styles',
    'unstyled'
  ]);

  const getStyles = useStyles<TypographyStylesProviderFactory>({
    name: 'TypographyStylesProvider',
    classes,
    props,
    className: local.className,
    style: local.style,
    classNames: local.classNames,
    styles: local.styles,
    unstyled: local.unstyled,
  });

  return <Box ref={ref} {...getStyles('root')} {...others} />;
});

TypographyStylesProvider.classes = classes;
TypographyStylesProvider.displayName = '@mantine/core/TypographyStylesProvider';
