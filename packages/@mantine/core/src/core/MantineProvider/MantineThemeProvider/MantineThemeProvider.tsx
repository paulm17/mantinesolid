import { createContext, createMemo, JSX, useContext } from 'solid-js';
import { DEFAULT_THEME } from '../default-theme';
import { mergeMantineTheme } from '../merge-mantine-theme';
import { MantineTheme, MantineThemeOverride } from '../theme.types';

export const MantineThemeContext = createContext<MantineTheme | null>(null);

export const useSafeMantineTheme = () => useContext(MantineThemeContext) || DEFAULT_THEME;

export function useMantineTheme() {
  const ctx = useContext(MantineThemeContext);

  if (!ctx) {
    throw new Error(
      '@mantine/core: MantineProvider was not found in component tree, make sure you have it in your app'
    );
  }

  return ctx;
}

export interface MantineThemeProviderProps {
  /** Determines whether theme should be inherited from parent MantineProvider, `true` by default */
  inherit?: boolean;

  /** Theme override object */
  theme?: MantineThemeOverride;

  /** Your application or part of the application that requires different theme */
  children?: JSX.Element;
}

// Don't destructure props, otherwise they lose their reactivity
export function MantineThemeProvider(props: MantineThemeProviderProps) {
  const { theme, inherit = true } = props;

  const parentTheme = useSafeMantineTheme();
  const mergedTheme = createMemo(() =>
    mergeMantineTheme(inherit ? parentTheme : DEFAULT_THEME, theme)
  );

  return (
    <MantineThemeContext.Provider value={mergedTheme()}>{props.children}</MantineThemeContext.Provider>
  );
}

MantineThemeProvider.displayName = '@mantine/core/MantineThemeProvider';
