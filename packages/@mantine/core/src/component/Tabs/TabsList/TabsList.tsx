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
import { useTabsContext } from '../Tabs.context';
import classes from '../Tabs.module.css';

export type TabsListStylesNames = 'list';

export interface TabsListProps
  extends BoxProps,
    CompoundStylesApiProps<TabsListFactory>,
    ElementProps<'div'> {
  /** `Tabs.Tab` components */
  children: JSX.Element;

  /** Determines whether tabs should take all available space, `false` by default */
  grow?: boolean;

  /** Tabs alignment, `flex-start` by default */
  justify?: JSX.CSSProperties['justify-content'];
}

export type TabsListFactory = Factory<{
  props: TabsListProps;
  ref: HTMLDivElement;
  stylesNames: TabsListStylesNames;
  compound: true;
}>;

const defaultProps: Partial<TabsListProps> = {};

export const TabsList = factory<TabsListFactory>((_props, ref) => {
  const props = useProps('TabsList', defaultProps, _props);
  const [local, others] = splitProps(props, [
    'children',
    'className',
    'grow',
    'justify',
    'classNames',
    'styles',
    'style',
    'mod',
  ]);

  const ctx = useTabsContext();

  return (
    <Box
      {...others}
      {...ctx.getStyles('list', {
        className: local.className,
        style: local.style,
        classNames: local.classNames,
        styles: local.styles,
        props,
        variant: ctx.variant,
      })}
      ref={ref}
      role="tablist"
      variant={ctx.variant}
      mod={[
        {
          grow: local.grow,
          orientation: ctx.orientation,
          placement: ctx.orientation === 'vertical' && ctx.placement,
          inverted: ctx.inverted,
        },
        local.mod,
      ]}
      aria-orientation={ctx.orientation}
      __vars={{ '--tabs-justify': local.justify }}
    >
      {local.children}
    </Box>
  );
});

TabsList.classes = classes;
TabsList.displayName = '@mantine/core/TabsList';
