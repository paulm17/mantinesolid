import { JSX } from 'solid-js';
import type { MantineTheme } from '../../MantineProvider';
import type { CssVarsProp, MantineStyleProp } from '../Box.types';

interface GetBoxStyleOptions {
  theme: MantineTheme;
  styleProps: JSX.CSSProperties;
  style?: MantineStyleProp;
  vars?: CssVarsProp;
}

function mergeStyles(
  styles: MantineStyleProp | CssVarsProp | undefined,
  theme: MantineTheme
): JSX.CSSProperties {
  if (Array.isArray(styles)) {
    return [...styles].reduce<Record<string, any>>(
      (acc, item) => ({ ...acc, ...mergeStyles(item, theme) }),
      {}
    );
  }

  if (typeof styles === 'function') {
    return styles(theme);
  }

  if (styles == null) {
    return {};
  }

  return styles;
}

export function getBoxStyle({
  theme,
  style,
  vars,
  styleProps,
}: GetBoxStyleOptions): JSX.CSSProperties {
  const _style = mergeStyles(style, theme);
  const _vars = mergeStyles(vars, theme);
  return { ..._style, ..._vars, ...styleProps };
}
