import cx from 'clsx';
import { createMemo, Show, splitProps, JSX, children } from 'solid-js';
import { Ref } from "@solid-primitives/refs";
import { Dynamic } from 'solid-js/web';
import { createPolymorphicComponent } from '../factory';
import { InlineStyles } from '../InlineStyles';
import { MantineBreakpoint, useMantineSxTransform, useMantineTheme } from '../MantineProvider';
import { isNumberLike } from '../utils';
import type { CssVarsProp, MantineStyleProp } from './Box.types';
import { getBoxMod } from './get-box-mod/get-box-mod';
import { getBoxStyle } from './get-box-style/get-box-style';
import {
  extractStyleProps,
  MantineStyleProps,
  parseStyleProps,
  STYlE_PROPS_DATA,
} from './style-props';
import { useRandomClassName } from './use-random-classname/use-random-classname';

export type Mod = Record<string, any> | string;
export type BoxMod = Mod | Mod[] | BoxMod[];

export interface BoxProps extends MantineStyleProps {
  /** Class added to the root element, if applicable */
  className?: string;

  /** Inline style added to root component element, can subscribe to theme defined on MantineProvider */
  style?: MantineStyleProp;

  /** CSS variables defined on root component element */
  __vars?: CssVarsProp;

  /** `size` property passed down the HTML element */
  __size?: string;

  /** Breakpoint above which the component is hidden with `display: none` */
  hiddenFrom?: MantineBreakpoint;

  /** Breakpoint below which the component is hidden with `display: none` */
  visibleFrom?: MantineBreakpoint;

  /** Determines whether component should be hidden in light color scheme with `display: none` */
  lightHidden?: boolean;

  /** Determines whether component should be hidden in dark color scheme with `display: none` */
  darkHidden?: boolean;

  /** Element modifiers transformed into `data-` attributes, for example, `{ 'data-size': 'xl' }`, falsy values are removed */
  mod?: BoxMod;
}

export type ElementProps<
  ElementType extends keyof JSX.IntrinsicElements,
  PropsToOmit extends string = never,
> = Omit<JSX.IntrinsicElements[ElementType], 'style' | PropsToOmit>;

export interface BoxComponentProps extends BoxProps {
  /** Variant passed from parent component, sets `data-variant` */
  variant?: string;

  /** Size passed from parent component, sets `data-size` if value is not number like */
  size?: string | number;
}

const _Box = <T extends HTMLElement = HTMLDivElement>(
  props: BoxComponentProps & {
    component?: any;
    className?: string;
    renderRoot?: any;
    ref?: Ref<T>;
    children?: any;
  }
) => {
  const [local, others] = splitProps(props, [
    'component',
    'style',
    '__vars',
    'className',
    'variant',
    'mod',
    'size',
    'hiddenFrom',
    'visibleFrom',
    'lightHidden',
    'darkHidden',
    'renderRoot',
    '__size',
    'ref',
    'children'
  ]);

  const theme = useMantineTheme();
  const Element = local.component || 'div';
  const { styleProps, rest } = extractStyleProps(others);

  const useSxTransform = useMantineSxTransform();
  const transformedSx = createMemo(() => useSxTransform?.()?.(styleProps.sx));
  const responsiveClassName = useRandomClassName();

  const parsedStyleProps = createMemo(() =>
    parseStyleProps({
      styleProps,
      theme,
      data: STYlE_PROPS_DATA,
    })
  );

  const elementProps = createMemo(() => {
    return {
      ref: local.ref,
      style: getBoxStyle({
        theme,
        style: local.style,
        vars: local.__vars,
        styleProps: parsedStyleProps().inlineStyles,
      }),
      className: cx(local.className, transformedSx(), {
        [responsiveClassName]: parsedStyleProps().hasResponsiveStyles,
        'mantine-light-hidden': local.lightHidden,
        'mantine-dark-hidden': local.darkHidden,
        [`mantine-hidden-from-${local.hiddenFrom}`]: local.hiddenFrom,
        [`mantine-visible-from-${local.visibleFrom}`]: local.visibleFrom,
      }),
      'data-variant': local.variant,
      'data-size': isNumberLike(local.size) ? undefined : local.size || undefined,
      size: local.__size,
      ...getBoxMod(local.mod),
      ...rest,
    };
  });

  return (
    <>
      <Show when={parsedStyleProps().hasResponsiveStyles}>
        <InlineStyles
          selector={`.${responsiveClassName}`}
          styles={parsedStyleProps().styles}
          media={parsedStyleProps().media}
        />
      </Show>

      {typeof local.renderRoot === 'function' ? (
        local.renderRoot(elementProps())
      ) : (
        <Dynamic component={Element} {...elementProps()}>
          {local.children}
        </Dynamic>
      )}
    </>
  );
};

_Box.displayName = '@mantine/core/Box';

export const Box = createPolymorphicComponent<'div', BoxComponentProps>(_Box);
