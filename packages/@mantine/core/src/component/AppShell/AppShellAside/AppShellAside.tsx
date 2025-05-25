import { splitProps } from 'solid-js';
import {
  Box,
  BoxProps,
  ElementProps,
  factory,
  Factory,
  StylesApiProps,
  useProps,
} from '../../../core';
import { useAppShellContext } from '../AppShell.context';
import classes from '../AppShell.module.css';

export type AppShellAsideStylesNames = 'aside';

export interface AppShellAsideProps
  extends BoxProps,
    StylesApiProps<AppShellAsideFactory>,
    ElementProps<'aside'> {
  /** Determines whether component should have a border, overrides `withBorder` prop on `AppShell` component */
  withBorder?: boolean;

  /** Component `z-index`, by default inherited from the `AppShell` */
  zIndex?: string | number;
}

export type AppShellAsideFactory = Factory<{
  props: AppShellAsideProps;
  ref: HTMLElement;
  stylesNames: AppShellAsideStylesNames;
}>;

const defaultProps: Partial<AppShellAsideProps> = {};

export const AppShellAside = factory<AppShellAsideFactory>(_props => {
  const props = useProps('AppShellAside', defaultProps, _props);
  const [local, others] = splitProps(props, [
    'classNames',
    'className',
    'style',
    'styles',
    'unstyled',
    'vars',
    'withBorder',
    'zIndex',
    'mod',
    'ref'
  ]);

  const ctx = useAppShellContext();

  if (ctx.disabled) {
    return null;
  }

  return (
    <Box
      component="aside"
      ref={local.ref}
      mod={[{ 'with-border': local.withBorder ?? ctx.withBorder }, local.mod]}
      {...ctx.getStyles('aside', { className: local.className, classNames: local.classNames, styles: local.styles, style: local.style })}
      {...others}
      __vars={{
        '--app-shell-aside-z-index': `calc(${local.zIndex ?? ctx.zIndex} + 1)`,
      }}
    />
  );
});

AppShellAside.classes = classes;
AppShellAside.displayName = '@mantine/core/AppShellAside';
