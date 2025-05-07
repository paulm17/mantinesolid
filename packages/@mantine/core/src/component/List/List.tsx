import {
  Box,
  BoxProps,
  createVarsResolver,
  ElementProps,
  factory,
  Factory,
  getFontSize,
  getLineHeight,
  getSpacing,
  MantineSize,
  MantineSpacing,
  StylesApiProps,
  useProps,
  useStyles,
} from '../../core';
import { ListProvider } from './List.context';
import { ListItem, ListItemStylesNames } from './ListItem/ListItem';
import classes from './List.module.css';
import { JSX, splitProps } from 'solid-js';

export type ListStylesNames = 'root' | ListItemStylesNames;
export type ListCssVariables = {
  root: '--list-fz' | '--list-lh' | '--list-spacing';
};

export interface ListProps
  extends BoxProps,
    StylesApiProps<ListFactory>,
    ElementProps<'ul', 'type'> {
  /** `List.Item` components only */
  children?: JSX.Element;

  /** List type: `ol` or `ul`, `'unordered'` by default */
  type?: 'ordered' | 'unordered';

  /** Determines whether list items should be offset with padding, `false` by default */
  withPadding?: boolean;

  /** Controls `font-size` and `line-height`, `'md'` by default */
  size?: MantineSize;

  /** Icon that replaces list item dot */
  icon?: JSX.Element;

  /** Key of `theme.spacing` or any valid CSS value to set spacing between items, `0` by default */
  spacing?: MantineSpacing;

  /** Determines whether items must be centered with their icon, `false` by default */
  center?: boolean;

  /** Controls `list-style-type`, by default inferred from `type` */
  listStyleType?: JSX.CSSProperties['list-style-type'];
}

export type ListFactory = Factory<{
  props: ListProps;
  ref: HTMLUListElement;
  stylesNames: ListStylesNames;
  vars: ListCssVariables;
  staticComponents: {
    Item: typeof ListItem;
  };
}>;

const defaultProps: Partial<ListProps> = {
  type: 'unordered',
};

const varsResolver = createVarsResolver<ListFactory>((_, { size, spacing }) => ({
  root: {
    '--list-fz': getFontSize(size),
    '--list-lh': getLineHeight(size),
    '--list-spacing': getSpacing(spacing),
  },
}));

export const List = factory<ListFactory>((_props, ref) => {
  const props = useProps('List', defaultProps, _props);
  const [local, others] = splitProps(props, [
    'classNames',
    'className',
    'style',
    'styles',
    'unstyled',
    'vars',
    'children',
    'type',
    'withPadding',
    'icon',
    'spacing',
    'center',
    'listStyleType',
    'mod',
    'ref'
  ]);

  const getStyles = useStyles<ListFactory>({
    name: 'List',
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
    <ListProvider value={{ center: local.center, icon: local.icon, getStyles }}>
      <Box<any>
        {...getStyles('root', { style: { listStyleType: local.listStyleType } })}
        component={local.type === 'unordered' ? ('ul' as const) : ('ol' as const)}
        mod={[{ 'with-padding': local.withPadding }, local.mod]}
        ref={ref}
        {...others}
      >
        {local.children}
      </Box>
    </ListProvider>
  );
});

List.classes = classes;
List.displayName = '@mantine/core/List';
List.Item = ListItem;
