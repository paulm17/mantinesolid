import type { MantineTheme } from '../../MantineProvider';
import type { MantineStyleProp } from '../Box.types';
import { JSX } from 'solid-js/jsx-runtime';

export function getStyleObject(
  style: MantineStyleProp | undefined,
  theme: MantineTheme
): JSX.CSSProperties {
  if (Array.isArray(style)) {
    return [...style].reduce<Record<string, any>>(
      (acc, item) => ({ ...acc, ...getStyleObject(item, theme) }),
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
