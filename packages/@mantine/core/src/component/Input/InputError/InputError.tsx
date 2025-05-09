import {
  Box,
  BoxProps,
  createVarsResolver,
  ElementProps,
  factory,
  Factory,
  getFontSize,
  MantineFontSize,
  rem,
  StylesApiProps,
  useProps,
  useStyles,
} from '../../../core';
import { useInputWrapperContext } from '../InputWrapper.context';
import classes from '../Input.module.css';
import { splitProps } from 'solid-js';

export type InputErrorStylesNames = 'error';
export type InputErrorCssVariables = {
  error: '--input-error-size';
};

export interface InputErrorProps
  extends BoxProps,
    StylesApiProps<InputErrorFactory>,
    ElementProps<'div'> {
  __staticSelector?: string;
  __inheritStyles?: boolean;

  /** Controls error `font-size`, `'sm'` by default */
  size?: MantineFontSize;
}

export type InputErrorFactory = Factory<{
  props: InputErrorProps;
  ref: HTMLParagraphElement;
  stylesNames: InputErrorStylesNames;
  vars: InputErrorCssVariables;
}>;

const defaultProps: Partial<InputErrorProps> = {};

const varsResolver = createVarsResolver<InputErrorFactory>((_, { size }) => ({
  error: {
    '--input-error-size': size === undefined ? undefined : `calc(${getFontSize(size)} - ${rem(2)})`,
  },
}));

export const InputError = factory<InputErrorFactory>((_props, ref) => {
  const props = useProps('InputError', defaultProps, _props);
  const [local, others] = splitProps(props, [
    'classNames',
    'className',
    'style',
    'styles',
    'unstyled',
    'vars',
    'size',
    '__staticSelector',
    '__inheritStyles',
    'variant'
  ]);
  const _getStyles = useStyles<InputErrorFactory>({
    name: ['InputWrapper', local.__staticSelector],
    props,
    classes,
    className: local.className,
    style: local.style,
    classNames: local.classNames,
    styles: local.styles,
    unstyled: local.unstyled,
    rootSelector: 'error',
    vars: local.vars,
    varsResolver,
  });

  const ctx = useInputWrapperContext();
  const getStyles = (local.__inheritStyles && ctx?.getStyles) || _getStyles;

  return (
    <Box
      component="p"
      ref={ref}
      variant={local.variant}
      size={local.size}
      {...getStyles('error', ctx?.getStyles ? { className: local.className, style: local.style } : undefined)}
      {...others}
    />
  );
});

InputError.classes = classes;
InputError.displayName = '@mantine/core/InputError';
