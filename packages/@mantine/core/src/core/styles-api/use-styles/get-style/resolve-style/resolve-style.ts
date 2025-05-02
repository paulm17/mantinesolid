import { JSX } from 'solid-js/jsx-runtime';
import { MantineStyleProp } from '../../../../Box';
import { MantineTheme } from '../../../../MantineProvider';

interface ResolveStyleInput {
  style: MantineStyleProp | undefined;
  theme: MantineTheme;
}

export function resolveStyle({ style, theme }: ResolveStyleInput): JSX.CSSProperties {
  if (Array.isArray(style)) {
    return [...style].reduce<Record<string, any>>(
      (acc, item) => ({ ...acc, ...resolveStyle({ style: item, theme }) }),
      {}
    );
  }

  if (typeof style === 'function') {
    return style(theme);
  }

  if (style == null) {
    return {};
  }

  return style;
}
