import { JSX, mergeProps } from 'solid-js';
import { ElementType, PolymorphicComponentProps } from './create-polymorphic-component';
import {
  ComponentClasses,
  FactoryPayload,
  identity,
  StaticComponents,
  ThemeExtend,
} from './factory';

export interface PolymorphicFactoryPayload extends FactoryPayload {
  defaultComponent: any;
  defaultRef: any;
}

export type PolymorphicComponentWithProps<Payload extends PolymorphicFactoryPayload> = {
  withProps: <C extends ElementType = Payload['defaultComponent']>(
    fixedProps: PolymorphicComponentProps<C, Payload['props']>
  ) => <L extends ElementType = C>(props: PolymorphicComponentProps<L, Payload['props']>) => JSX.Element;
};

export function polymorphicFactory<Payload extends PolymorphicFactoryPayload>(
  ui: (props: Payload['props'], ref?: Payload['defaultRef']) => JSX.Element
) {
  type ComponentProps<C extends ElementType> = PolymorphicComponentProps<C, Payload['props']>;

  type _PolymorphicComponent = <C extends ElementType = Payload['defaultComponent']>(
    props: ComponentProps<C>,
    ref: Payload['defaultRef']
  ) => JSX.Element;

  type ComponentProperties = Omit<(props: ComponentProps<any>) => JSX.Element, never>;

  type PolymorphicComponent = _PolymorphicComponent &
    ComponentProperties &
    ThemeExtend<Payload> &
    ComponentClasses<Payload> &
    PolymorphicComponentWithProps<Payload> &
    StaticComponents<Payload['staticComponents']> & {
      displayName?: string | undefined;
    };

  // Create the component function
  const Component = ((props: any, ref: any) => {
    return ui(props, ref);
  }) as unknown as PolymorphicComponent;

  // Add withProps method
  Component.withProps = (fixedProps: any) => {
    const Extended = ((props: any, ref: any) => {
      // Merge the fixed props with the passed props
      const mergedProps = mergeProps(fixedProps, props);
      // In SolidJS, we need to pass the props directly to the function
      return ui(mergedProps, ref);
    }) as any;

    Extended.extend = Component.extend;
    Extended.displayName = `WithProps(${Component.displayName})`;
    return Extended;
  };

  Component.extend = identity as any;

  return Component as PolymorphicComponent;
}
