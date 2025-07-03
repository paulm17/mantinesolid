import { Component } from 'solid-js';
import { createSafeContext, GetStylesApi, MantineRadius } from '../../core';
import type { DrawerRootFactory } from './DrawerRoot';

export type ScrollAreaComponent = Component<any>;

interface DrawerContext {
  scrollAreaComponent: ScrollAreaComponent | undefined;
  getStyles: GetStylesApi<DrawerRootFactory>;
  radius: MantineRadius | undefined;
}

export const [DrawerProvider, useDrawerContext] = createSafeContext<DrawerContext>(
  'Drawer component was not found in tree'
);
