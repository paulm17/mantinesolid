import { JSX, splitProps, Component } from "solid-js";
import { Ref } from "@solid-primitives/refs";
import type { MantineThemeComponent } from "../MantineProvider";
import type { ClassNames, PartialVarsResolver, Styles } from "../styles-api";

// FactoryPayload shape mirrors React version
export interface FactoryPayload {
  props: Record<string, any>;
  ref?: any;
  ctx?: any;
  stylesNames?: string;
  vars?: any;
  variant?: string;
  staticComponents?: Record<string, any>;
  compound?: boolean;
}

export type DataAttributes = Record<`data-${string}`, any>;

export interface ExtendCompoundComponent<Payload extends FactoryPayload> {
  defaultProps?: Partial<Payload["props"]> & DataAttributes;
}

export interface ExtendsRootComponent<Payload extends FactoryPayload> {
  defaultProps?: Partial<Payload["props"]> & DataAttributes;
  classNames?: ClassNames<Payload>;
  styles?: Styles<Payload>;
  vars?: PartialVarsResolver<Payload>;
}

// Helper type to extract static components
export type StaticComponents<Input> = Input extends Record<string, any> ? Input : Record<string, never>;

// Extend API attached to each component
export interface ExtendComponent<Payload extends FactoryPayload> {
  withProps: (props: Partial<Omit<Payload['props'], 'ref'>>) => SolidFactoryComponent<Payload>;
  extend: (input: any) => any;
  displayName?: string;
  classes?: Record<string, string>;
}

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
> & MantineComponentStaticProperties<Payload>;

// A Solid component built by factory for a given Payload
// We omit 'ref' from props spread so it cannot be duplicated
export type SolidFactoryComponent<Payload extends FactoryPayload> =
  ((props: Omit<Payload['props'], 'ref'> & { ref?: Ref<Payload['ref']> }) => JSX.Element)
  & ExtendComponent<Payload>
  & StaticComponents<Payload["staticComponents"]>;

// Define the type of our internal forward-ref render function
export type ForwardRefRenderFunction<RefType, Props> = (props: Props, ref: RefType) => JSX.Element;

/** identity utility **/
export function identity<T>(value: T): T {
  return value;
}

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

/**
 * factory: create a Solid component with Mantine-like factory API
 * @param ui render function receiving (props, ref)
 */
export function factory<Payload extends FactoryPayload>(
  ui: (props: Omit<Payload['props'], 'ref'>, ref?: Ref<Payload['ref']>) => JSX.Element
): SolidFactoryComponent<Payload> {
  const Component = ((allProps: Omit<Payload['props'], 'ref'> & { ref?: Ref<Payload['ref']> }) => {
    const [local, others] = splitProps(allProps, ['ref']);

    return ui(others as Payload['props'], local.ref);
  }) as SolidFactoryComponent<Payload>;

  Component.extend = identity;
  Component.withProps = (fixed: Partial<Omit<Payload['props'], 'ref'>>) => {
    const Extended = ((props: Omit<Payload['props'], 'ref'> & { ref?: Ref<Payload['ref']> }) =>
      Component({ ...fixed, ...props })) as SolidFactoryComponent<Payload>;
    Extended.extend = Component.extend;
    Extended.displayName = `WithProps`;
    return Extended;
  };

  return Component;
}
