import { Component, JSX } from 'solid-js';

// Utility types for polymorphic components
// Combine override props with base props
export type ExtendedProps<Props = {}, OverrideProps = {}> = OverrideProps &
  Omit<Props, keyof OverrideProps>;

// Valid element types: intrinsic JSX tags or Solid components
export type ElementType = keyof JSX.IntrinsicElements | Component<any>;

// Get props of an ElementType
export type PropsOf<C extends ElementType> = C extends keyof JSX.IntrinsicElements
  ? JSX.IntrinsicElements[C]
  : C extends Component<infer P>
    ? P
    : {};

// Allow passing a custom `component` prop
export type ComponentProp<C> = { component?: C };

// Inherit props from C then add P
export type InheritedProps<C extends ElementType, P = {}> = ExtendedProps<PropsOf<C>, P>;

// Support `ref` prop on components
export type PolymorphicRef<C extends ElementType> = C extends Component<any> ? { ref?: any } : {};

// Final polymorphic props: inherited, ref, plus optional renderRoot
export type PolymorphicComponentProps<C extends ElementType, P = {}> = InheritedProps<
  C,
  P & ComponentProp<C>
> &
  PolymorphicRef<C> & {
    renderRoot?: (props: any) => any;
  };

// Factory that casts raw component to a properly typed polymorphic component
export function createPolymorphicComponent<
  DefaultComponent extends ElementType,
  P,
  StaticComponents = Record<string, never>,
>(component: any) {
  type ComponentProps<C extends ElementType> = PolymorphicComponentProps<C, P>;
  type _PolymorphicComponent = <C extends ElementType = DefaultComponent>(
    props: ComponentProps<C>
  ) => JSX.Element;
  type ComponentProperties = Omit<Component<ComponentProps<any>>, never>;
  type PolymorphicComponent = _PolymorphicComponent & ComponentProperties & StaticComponents;

  return component as PolymorphicComponent;
}
