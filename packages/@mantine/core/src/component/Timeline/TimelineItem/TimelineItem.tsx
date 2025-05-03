import { JSX } from 'solid-js/jsx-runtime';
import {
  Box,
  BoxProps,
  CompoundStylesApiProps,
  ElementProps,
  factory,
  Factory,
  getRadius,
  getThemeColor,
  MantineColor,
  MantineRadius,
  useMantineTheme,
  useProps,
} from '../../../core';
import { useTimelineContext } from '../Timeline.context';
import classes from '../Timeline.module.css';
import { splitProps } from 'solid-js';

export type TimelineItemStylesNames =
  | 'itemBody'
  | 'itemContent'
  | 'itemBullet'
  | 'item'
  | 'itemTitle';

export interface TimelineItemProps
  extends BoxProps,
    CompoundStylesApiProps<TimelineItemFactory>,
    ElementProps<'div', 'title'> {
  /** Determines whether the item should be highlighted, controlled by the parent `Timeline` component  */
  __active?: boolean;

  /** Determines whether the line of the item should be highlighted, controlled by the parent Timeline component */
  __lineActive?: boolean;

  /** Line and bullet position relative to item content, controlled by the parent Timeline component */
  __align?: 'right' | 'left';

  /** Item title, displayed next to the bullet */
  title?: JSX.Element;

  /** Content displayed below the title */
  children?: JSX.Element;

  /** React node that should be rendered inside the bullet – icon, image, avatar, etc. By default, large white dot is displayed. */
  bullet?: JSX.Element;

  /** Key of `theme.radius` or any valid CSS value to set `border-radius`, numbers are converted to rem, `'xl'` by default */
  radius?: MantineRadius;

  /** Key of `theme.colors` or any valid CSS color to control active item colors, `theme.primaryColor` by default */
  color?: MantineColor;

  /** Controls line border style, `'solid'` by default */
  lineVariant?: 'solid' | 'dashed' | 'dotted';
}

export type TimelineItemFactory = Factory<{
  props: TimelineItemProps;
  ref: HTMLDivElement;
  stylesNames: TimelineItemStylesNames;
  compound: true;
}>;

const defaultProps: Partial<TimelineItemProps> = {};

export const TimelineItem = factory<TimelineItemFactory>((_props, ref) => {
  const props = useProps('TimelineItem', defaultProps, _props);
  const [local, others] = splitProps(props, [
    'classNames',
    'className',
    'style',
    'styles',
    'vars',
    '__active',
    '__align',
    '__lineActive',
    '__vars',
    'bullet',
    'radius',
    'color',
    'lineVariant',
    'children',
    'title',
    'mod',
    'ref'
  ]);

  const ctx = useTimelineContext();
  const theme = useMantineTheme();

  const stylesApiProps = { classNames: local.classNames, styles: local.styles };

  return (
    <Box
      {...ctx.getStyles('item', { ...stylesApiProps, className: local.className, style: local.style })}
      mod={[{ 'line-active': local.__lineActive, active: local.__active }, local.mod]}
      ref={ref}
      __vars={{
        '--tli-radius': local.radius ? getRadius(local.radius) : undefined,
        '--tli-color': local.color ? getThemeColor(local.color, theme) : undefined,
        '--tli-border-style': local.lineVariant || undefined,
      }}
      {...others}
    >
      <Box
        {...ctx.getStyles('itemBullet', stylesApiProps)}
        mod={{ 'with-child': !!local.bullet, align: local.__align, active: local.__active }}
      >
        {local.bullet}
      </Box>

      <div {...ctx.getStyles('itemBody', stylesApiProps)}>
        {local.title && <div {...ctx.getStyles('itemTitle', stylesApiProps)}>{local.title}</div>}
        <div {...ctx.getStyles('itemContent', stylesApiProps)}>{local.children}</div>
      </div>
    </Box>
  );
});

TimelineItem.classes = classes;
TimelineItem.displayName = '@mantine/core/TimelineItem';
