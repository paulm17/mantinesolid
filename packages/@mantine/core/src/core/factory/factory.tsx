import { JSX, Component } from "solid-js";
import type { MantineThemeComponent } from "../MantineProvider";
import type { ClassNames, PartialVarsResolver, Styles } from "../styles-api";

export type DataAttributes = Record<`data-${string}`, any>;

export interface FactoryPayload {
  props: Record<string, any>;
  ctx?: any;
  ref?: any;
  stylesNames?: string;
  vars?: any;
  variant?: string;
  staticComponents?: Record<string, any>;
  compound?: boolean;
}

export interface ExtendCompoundComponent<Payload extends FactoryPayload> {
  defaultProps?: Partial<Payload["props"]> & DataAttributes;
}

export interface ExtendsRootComponent<Payload extends FactoryPayload> {
  defaultProps?: Partial<Payload["props"]> & DataAttributes;
  classNames?: ClassNames<Payload>;
  styles?: Styles<Payload>;
  vars?: PartialVarsResolver<Payload>;
}

export type ExtendComponent<Payload extends FactoryPayload> = Payload["compound"] extends true
  ? ExtendCompoundComponent<Payload>
  : ExtendsRootComponent<Payload>;

export type StaticComponents<Input> = Input extends Record<string, any> ? Input : Record<string, never>;

export interface ThemeExtend<Payload extends FactoryPayload> {
  extend: (input: ExtendComponent<Payload>) => MantineThemeComponent;
}

export type ComponentClasses<Payload extends FactoryPayload> = {
  classes: Payload["stylesNames"] extends string ? Record<string, string> : never;
};

export type FactoryComponentWithProps<Payload extends FactoryPayload> = {
  withProps: (props: Partial<Payload["props"]>) => MantineComponent<Payload>;
  displayName?: string;
};

export type MantineComponentStaticProperties<Payload extends FactoryPayload> =
  ThemeExtend<Payload> &
  ComponentClasses<Payload> &
  StaticComponents<Payload["staticComponents"]> &
  FactoryComponentWithProps<Payload> & {
    displayName?: string;
  };

// We omit `ref` from the spreadable props and rely on Solid's forwarded ref argument
export type MantineComponent<Payload extends FactoryPayload> = Component<
  Omit<Payload["props"], "ref"> & { component?: any; renderRoot?: (props: any) => JSX.Element }
> &
  MantineComponentStaticProperties<Payload>;

export function identity<T>(value: T): T {
  return value;
}

// Define the type of our internal forward-ref render function
export type ForwardRefRenderFunction<RefType, Props> = (props: Props, ref: RefType) => JSX.Element;

// Helper to wrap any Solid component with fixed props
export function getWithProps<T extends Component<any>, Props>(Component: T): (props: Partial<Props>) => T {
  const _Component = Component as any;
  return (fixedProps: any) => {
    const Extended: any = (props: any) => <_Component {...fixedProps} {...props} />;
    Extended.extend = _Component.extend;
    Extended.displayName = `WithProps(${_Component.displayName})`;
    return Extended;
  };
}

export function factory<Payload extends FactoryPayload>(
  ui: ForwardRefRenderFunction<Payload["ref"], Payload["props"]>
) {
  // wrap ui into a Solid component that forwards ref as second argument
  const Component: any = (props: any) => {
    return (ui as any)(props, props.ref);
  };

  Component.extend = identity as any;
  Component.withProps = (fixedProps: any) => {
    const Extended: any = (props: any) => <Component {...fixedProps} {...props} />;
    Extended.extend = Component.extend;
    Extended.displayName = `WithProps(${Component.displayName})`;
    return Extended;
  };

  return Component as MantineComponent<Payload>;
}
