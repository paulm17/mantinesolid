import { JSX } from "solid-js";

export interface SvgLoaderProps extends JSX.HTMLAttributes<any> {}

export interface MantineLoaderComponent {
  (props: JSX.HTMLAttributes<any> & { ref?: any }): JSX.Element;
  displayName?: string;
}

export type MantineLoadersRecord = Partial<
  Record<'bars' | 'dots' | 'oval' | (string & {}), MantineLoaderComponent>
>;
export type MantineLoader = keyof MantineLoadersRecord;
