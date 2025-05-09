import {
  Box,
  BoxProps,
  createVarsResolver,
  ElementProps,
  factory,
  Factory,
  getFontSize,
  MantineFontSize,
  StylesApiProps,
  useProps,
  useStyles,
} from '../../../core';
import { useInputWrapperContext } from '../InputWrapper.context';
import classes from '../Input.module.css';
import { splitProps } from 'solid-js';

export type InputLabelStylesNames = 'label' | 'required';
export type InputLabelCssVariables = {
  label: '--input-asterisk-color' | '--input-label-size';
};

export interface InputLabelProps
  extends BoxProps,
    StylesApiProps<InputLabelFactory>,
    ElementProps<'label'> {
  __staticSelector?: string;

  /** Determines whether the required asterisk should be displayed  */
  required?: boolean;

  /** Controls label `font-size`, `'sm'` by default */
  size?: MantineFontSize;

  /** Root element of the label, `'label'` by default */
  labelElement?: 'label' | 'div';
}

export type InputLabelFactory = Factory<{
  props: InputLabelProps;
  ref: HTMLLabelElement;
  stylesNames: InputLabelStylesNames;
  vars: InputLabelCssVariables;
}>;

const defaultProps: Partial<InputLabelProps> = {
  labelElement: 'label',
};

const varsResolver = createVarsResolver<InputLabelFactory>((_, { size }) => ({
  label: {
    '--input-label-size': getFontSize(size),
    '--input-asterisk-color': undefined,
  },
}));

export const InputLabel = factory<InputLabelFactory>((_props, ref) => {
  const props = useProps('InputLabel', defaultProps, _props);
  const [local, others] = splitProps(props, [
    'classNames',
    'className',
    'style',
    'styles',
    'unstyled',
    'vars',
    'labelElement',
    'size',
    'required',
    'for',
    'onMouseDown',
    'children',
    '__staticSelector',
    'variant',
    'mod'
  ]);

  const _getStyles = useStyles<InputLabelFactory>({
    name: ['InputWrapper', local.__staticSelector],
    props,
    classes,
    className: local.className,
    style: local.style,
    classNames: local.classNames,
    styles: local.styles,
    unstyled: local.unstyled,
    rootSelector: 'label',
    vars: local.vars,
    varsResolver,
  });

  const ctx = useInputWrapperContext();
  const getStyles = ctx?.getStyles || _getStyles;

  return (
    <Box
      {...getStyles('label', ctx?.getStyles ? { className: local.className, style: local.style } : undefined)}
      component={local.labelElement as 'label'}
      variant={local.variant}
      size={local.size}
      ref={ref}
      for={local.labelElement === 'label' ? local.for : undefined}
      mod={[{ required: local.required }, local.mod]}
      onMouseDown={(event) => {
        if (typeof local.onMouseDown === 'function') {
          local.onMouseDown(event);
        }
        if (!event.defaultPrevented && event.detail > 1) {
          event.preventDefault();
        }
      }}
      {...others}
    >
      {local.children}
      {local.required && (
        <span {...getStyles('required')} aria-hidden>
          {' *'}
        </span>
      )}
    </Box>
  );
});

InputLabel.classes = classes;
InputLabel.displayName = '@mantine/core/InputLabel';
