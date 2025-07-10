import { JSX, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { useMergedRef } from '@mantine/hooks';
import {
  Box,
  createVarsResolver,
  factory,
  Factory,
  getDefaultZIndex,
  getRadius,
  getRefProp,
  getStyleObject,
  getThemeColor,
  isElement,
  useMantineTheme,
  useProps,
  useStyles,
} from '../../../core';
import { OptionalPortal } from '../../Portal';
import { TooltipBaseProps, TooltipCssVariables, TooltipStylesNames } from '../Tooltip.types';
import { useFloatingTooltip } from './use-floating-tooltip';
import classes from '../Tooltip.module.css';

export interface TooltipFloatingProps extends TooltipBaseProps {
  /** Offset from mouse in px, `10` by default */
  offset?: number;
  /** Uncontrolled tooltip initial opened state */
  defaultOpened?: boolean;
}

export type TooltipFloatingFactory = Factory<{
  props: TooltipFloatingProps;
  ref: HTMLDivElement;
  stylesNames: TooltipStylesNames;
  vars: TooltipCssVariables;
}>;

const defaultProps: Partial<TooltipFloatingProps> = {
  refProp: 'ref',
  withinPortal: true,
  offset: 10,
  defaultOpened: false,
  position: 'right',
  zIndex: getDefaultZIndex('popover'),
};

const varsResolver = createVarsResolver<TooltipFloatingFactory>((theme, { radius, color }) => ({
  tooltip: {
    '--tooltip-radius': radius === undefined ? undefined : getRadius(radius),
    '--tooltip-bg': color ? getThemeColor(color, theme) : undefined,
    '--tooltip-color': color ? 'var(--mantine-color-white)' : undefined,
  },
}));

export const TooltipFloating = factory<TooltipFloatingFactory>(_props => {
  const props = useProps('TooltipFloating', defaultProps, _props);
  const [local, others] = splitProps(props, [
    'children',
    'refProp',
    'withinPortal',
    'style',
    'className',
    'classNames',
    'styles',
    'unstyled',
    'radius',
    'color',
    'label',
    'offset',
    'position',
    'multiline',
    'zIndex',
    'disabled',
    'defaultOpened',
    'variant',
    'vars',
    'portalProps',
    'ref',
  ])

  const theme = useMantineTheme();
  const getStyles = useStyles<TooltipFloatingFactory>({
    name: 'TooltipFloating',
    props,
    classes,
    className: local.className,
    style: local.style,
    classNames: local.classNames,
    styles: local.styles,
    unstyled: local.unstyled,
    rootSelector: 'tooltip',
    vars: local.vars,
    varsResolver,
  });

  const floating = useFloatingTooltip({
    offset: local.offset!,
    position: local.position!,
    defaultOpened: local.defaultOpened!,
  });

  // if (!isElement(local.children)) {
  //   throw new Error(
  //     '[@mantine/core] Tooltip.Floating component children should be an element or a component that accepts ref, fragments, strings, numbers and other primitive values are not supported'
  //   );
  // }

  const targetRef = useMergedRef(floating.boundaryRef, getRefProp(local.children), local.ref);
  const _childrenProps = (local.children as any).props as any;

  const onMouseEnter = (event: MouseEvent) => {
    console.log('mouseenter called');
    _childrenProps.onMouseEnter?.(event);
    floating.handleMouseMove(event);
    floating.setOpened(true);
  };

  const onMouseLeave = (event: MouseEvent) => {
    _childrenProps.onMouseLeave?.(event);
    floating.setOpened(false);
  };

  console.log('opened:', floating.opened(), 'disabled:', local.disabled);

  const isSvgChild = targetRef?.parentElement?.tagName === 'svg' ? 'g' : 'span';

  return (
    <>
      <OptionalPortal {...local.portalProps} withinPortal={local.withinPortal}>
        <Box
          {...others}
          {...getStyles('tooltip', {
            style: {
              ...getStyleObject(local.style, theme),
              zIndex: local.zIndex as JSX.CSSProperties['z-index'],
              display: !local.disabled && floating.opened() ? 'block' : 'none',
              top: `${(floating.y && Math.round(floating.y)) ?? ''}`,
              left: `${(floating.x && Math.round(floating.x)) ?? ''}`,
            },
          })}
          variant={local.variant}
          ref={(el) => floating.floating(el)}
          mod={{ multiline: local.multiline }}
        >
          {local.label}
        </Box>
      </OptionalPortal>

      <Dynamic
        component={isSvgChild ? 'g' : 'span'}
        ref={targetRef}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {local.children}
      </Dynamic>
    </>
  );
});

TooltipFloating.classes = classes;
TooltipFloating.displayName = '@mantine/core/TooltipFloating';
