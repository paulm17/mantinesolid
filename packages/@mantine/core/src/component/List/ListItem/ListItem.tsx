import { JSX, splitProps } from 'solid-js';
import {
  Box,
  BoxProps,
  CompoundStylesApiProps,
  ElementProps,
  factory,
  Factory,
  useProps,
} from '../../../core';
import { useListContext } from '../List.context';
import classes from '../List.module.css';

export type ListItemStylesNames = 'item' | 'itemWrapper' | 'itemIcon' | 'itemLabel';

export interface ListItemProps
  extends BoxProps,
    CompoundStylesApiProps<ListItemFactory>,
    ElementProps<'li'> {
  /** Icon to replace item bullet */
  icon?: JSX.Element;

  /** Item content */
  children?: JSX.Element;
}

export type ListItemFactory = Factory<{
  props: ListItemProps;
  ref: HTMLLIElement;
  stylesNames: ListItemStylesNames;
  compound: true;
}>;

const defaultProps: Partial<ListItemProps> = {};

export const ListItem = factory<ListItemFactory>((_props, ref) => {
  const props = useProps('ListItem', defaultProps, _props);
  const [local, others] = splitProps(props, [
    'classNames',
    'className',
    'style',
    'styles',
    'vars',
    'icon',
    'children',
    'mod'
  ]);

  const ctx = useListContext();
  const _icon = local.icon || ctx.icon;
  const stylesApiProps = { classNames: local.classNames, styles: local.styles };

  return (
    <Box
      {...ctx.getStyles('item', { ...stylesApiProps, className: local.className, style: local.style })}
      component="li"
      mod={[{ 'with-icon': !!_icon, centered: ctx.center }, local.mod]}
      ref={ref}
      {...others}
    >
      <div {...ctx.getStyles('itemWrapper', stylesApiProps)}>
        {_icon && <span {...ctx.getStyles('itemIcon', stylesApiProps)}>{_icon}</span>}
        <span {...ctx.getStyles('itemLabel', stylesApiProps)}>{local.children}</span>
      </div>
    </Box>
  );
});

ListItem.classes = classes;
ListItem.displayName = '@mantine/core/ListItem';
