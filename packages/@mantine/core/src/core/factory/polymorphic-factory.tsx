import { JSX, mergeProps, Ref } from 'solid-js';
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
  ) => <L extends ElementType = C>(
    props: PolymorphicComponentProps<L, Payload['props']> & { ref?: Ref<Payload['defaultRef']> }
  ) => JSX.Element;
};

export function polymorphicFactory<Payload extends PolymorphicFactoryPayload>(
  ui: (props: Payload['props'], ref?: Ref<Payload['defaultRef']>) => JSX.Element
) {
  type ComponentProps<C extends ElementType> = PolymorphicComponentProps<C, Payload['props']>;

  type _PolymorphicComponent = <C extends ElementType = Payload['defaultComponent']>(
    // props: ComponentProps<C> & { ref?: Ref<Payload['defaultRef']> }
    props: ComponentProps<C> & { ref?: Ref<any> }
  ) => JSX.Element;

  type ComponentProperties = Omit<(props: ComponentProps<any> & { ref?: Ref<Payload['defaultRef']> }) => JSX.Element, never>;

  type PolymorphicComponent = _PolymorphicComponent &
    ComponentProperties &
    ThemeExtend<Payload> &
    ComponentClasses<Payload> &
    PolymorphicComponentWithProps<Payload> &
    StaticComponents<Payload['staticComponents']> & {
      displayName?: string | undefined;
    };

  // Create the component function
  const Component = (<C extends ElementType = Payload['defaultComponent']>(
    allProps: ComponentProps<C> & { ref?: Ref<Payload['defaultRef']> }
  ) => {
    // a) Extract `ref` from the incoming props:
    const { ref, ...rest } = allProps as any;

    // b) Now call `ui(rest, ref)`.  Rest contains everything except `ref`.
    return ui(rest as Payload['props'], ref);
  }) as unknown as PolymorphicComponent;


  // Add withProps method
  Component.withProps = <C extends ElementType = Payload['defaultComponent']>(
    fixedProps: PolymorphicComponentProps<C, Payload['props']>
  ) => {
    const Extended = (<L extends ElementType = C>(
      allProps: PolymorphicComponentProps<L, Payload['props']> & { ref?: Ref<Payload['defaultRef']> }
    ) => {
      // a) merge the incoming props with fixedProps:
      const merged = mergeProps(fixedProps as any, allProps as any);

      // b) pull `ref` out of that merged object:
      const { ref: refHandler, ...rest } = merged as any;

      // c) call the same UI callback with “rest” + refHandler
      return ui(rest as Payload['props'], refHandler);
    }) as any;

    Extended.extend = Component.extend;
    Extended.displayName = `WithProps(${Component.displayName})`;
    return Extended;
  };

  Component.extend = identity as any;

  return Component as PolymorphicComponent;
}
