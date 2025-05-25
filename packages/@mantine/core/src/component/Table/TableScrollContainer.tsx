import { splitProps, JSX } from 'solid-js';
import {
  Box,
  BoxProps,
  createVarsResolver,
  ElementProps,
  factory,
  Factory,
  rem,
  StylesApiProps,
  useProps,
  useStyles,
} from '../../core';
import { ScrollArea } from '../ScrollArea';
import classes from './Table.module.css';

export type TableScrollContainerStylesNames = 'scrollContainer' | 'scrollContainerInner';
export type TableScrollContainerCssVariables = {
  scrollContainer: '--table-min-width' | '--table-max-height' | '--table-overflow';
};

export interface TableScrollContainerProps
  extends BoxProps,
    StylesApiProps<TableScrollContainerFactory>,
    ElementProps<'div'> {
  /** `min-width` of the `Table` at which it should become scrollable */
  minWidth: JSX.CSSProperties['min-width'];
  /** `max-height` of the `Table` at which it should become scrollable */
  maxHeight?: JSX.CSSProperties['max-height'];

  /** Type of the scroll container, `native` to use native scrollbars, `scrollarea` to use `ScrollArea` component, `scrollarea` by default */
  type?: 'native' | 'scrollarea';
}

export type TableScrollContainerFactory = Factory<{
  props: TableScrollContainerProps;
  ref: HTMLDivElement;
  stylesNames: TableScrollContainerStylesNames;
  vars: TableScrollContainerCssVariables;
}>;

const defaultProps: Partial<TableScrollContainerProps> = {
  type: 'scrollarea',
};

const varsResolver = createVarsResolver<TableScrollContainerFactory>(
  (_, { minWidth, maxHeight, type }) => ({
    scrollContainer: {
      '--table-min-width': rem(minWidth),
      '--table-max-height': rem(maxHeight),
      '--table-overflow': type === 'native' ? 'auto' : undefined,
    },
  })
);

export const TableScrollContainer = factory<TableScrollContainerFactory>(_props => {
  const props = useProps('TableScrollContainer', defaultProps, _props);
  const [local, others] = splitProps(props, [
    'classNames',
    'className',
    'style',
    'styles',
    'unstyled',
    'vars',
    'children',
    'minWidth',
    'maxHeight',
    'type',
    'ref'
  ]);

  const getStyles = useStyles<TableScrollContainerFactory>({
    name: 'TableScrollContainer',
    classes,
    props,
    className: local.className,
    style: local.style,
    classNames: local.classNames,
    styles: local.styles,
    unstyled: local.unstyled,
    vars: local.vars,
    varsResolver,
    rootSelector: 'scrollContainer',
  });

  return (
    <Box<any>
      component={local.type === 'scrollarea' ? ScrollArea : 'div'}
      {...(local.type === 'scrollarea'
        ? local.maxHeight
          ? { offsetScrollbars: 'xy' }
          : { offsetScrollbars: 'x' }
        : {})}
      ref={local.ref}
      {...getStyles('scrollContainer')}
      {...others}
    >
      <div {...getStyles('scrollContainerInner')}>{local.children}</div>
    </Box>
  );
});

TableScrollContainer.classes = classes;
TableScrollContainer.displayName = '@mantine/core/TableScrollContainer';
