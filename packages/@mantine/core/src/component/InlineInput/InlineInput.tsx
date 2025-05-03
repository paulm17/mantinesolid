import { splitProps } from 'solid-js';
import {
  Box,
  BoxProps,
  ElementProps,
  Factory,
  getFontSize,
  getSize,
  MantineSize,
  StylesApiProps,
  useStyles,
} from '../../core';
import { Input } from '../Input';
import classes from './InlineInput.module.css';
import { JSX } from 'solid-js/jsx-runtime';

export const InlineInputClasses = classes;

export type InlineInputStylesNames =
  | 'root'
  | 'body'
  | 'labelWrapper'
  | 'label'
  | 'description'
  | 'error';

export interface InlineInputProps
  extends BoxProps,
    StylesApiProps<InlineInputFactory>,
    ElementProps<'div'> {
  __staticSelector: string;
  __stylesApiProps: Record<string, any>;
  label: JSX.Element;
  description: JSX.Element;
  id: string;
  disabled: boolean | undefined;
  error: JSX.Element;
  size: MantineSize | (string & {}) | undefined;
  labelPosition?: 'left' | 'right';
  bodyElement?: any;
  labelElement?: any;
}

export type InlineInputFactory = Factory<{
  props: any;
  stylesNames: InlineInputStylesNames;
}>;

export function InlineInput(props: InlineInputProps) {
  const [local, others] = splitProps(props, [
    '__staticSelector',
    '__stylesApiProps',
    'className',
    'classNames',
    'styles',
    'unstyled',
    'children',
    'label',
    'description',
    'id',
    'disabled',
    'error',
    'size',
    'labelPosition',
    'bodyElement',
    'labelElement',
    'variant',
    'style',
    'vars',
    'mod',
    'ref'
  ]);

  const getStyles = useStyles<InlineInputFactory>({
    name: local.__staticSelector,
    props: local.__stylesApiProps,
    className: local.className,
    style: local.style,
    classes,
    classNames: local.classNames,
    styles: local.styles,
    unstyled: local.unstyled,
  });

  return (
    <Box
      {...getStyles('root')}
      ref={local.ref}
      __vars={{
        '--label-fz': getFontSize(local.size),
        '--label-lh': getSize(local.size, 'label-lh'),
      }}
      mod={[{ 'label-position': local.labelPosition }, local.mod]}
      variant={local.variant}
      size={local.size}
      {...others}
    >
      <Box
        component={local.bodyElement}
        htmlFor={local.bodyElement === 'label' ? local.id : undefined}
        {...getStyles('body')}
      >
        {local.children}

        <div {...getStyles('labelWrapper')} data-disabled={local.disabled || undefined}>
          {local.label && (
            <Box
              component={local.labelElement}
              htmlFor={local.labelElement === 'label' ? local.id : undefined}
              {...getStyles('label')}
              data-disabled={local.disabled || undefined}
            >
              {local.label}
            </Box>
          )}

          {local.description && (
            <Input.Description size={local.size} __inheritStyles={false} {...getStyles('description')}>
              {local.description}
            </Input.Description>
          )}

          {local.error && typeof local.error !== 'boolean' && (
            <Input.Error size={local.size} __inheritStyles={false} {...getStyles('error')}>
              {local.error}
            </Input.Error>
          )}
        </div>
      </Box>
    </Box>
  );
}

InlineInput.displayName = '@mantine/core/InlineInput';
