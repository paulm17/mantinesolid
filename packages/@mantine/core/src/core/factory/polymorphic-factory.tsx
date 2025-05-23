import { JSX, mergeProps, Ref, splitProps } from 'solid-js';
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
    console.log('allProps', allProps);

    const [props, rest] = splitProps(allProps, ['ref']);

    return ui(rest as Payload['props'], props.ref);
  }) as unknown as PolymorphicComponent;


  // Add withProps method
  Component.withProps = <C extends ElementType = Payload['defaultComponent']>(
    fixedProps: PolymorphicComponentProps<C, Payload['props']>
  ) => {
    const Extended = (<L extends ElementType = C>(
      allProps: PolymorphicComponentProps<L, Payload['props']> & { ref?: Ref<Payload['defaultRef']> }
    ) => {
      const merged = mergeProps(fixedProps as any, allProps as any);
      const [props, ref] = splitProps(merged, ['ref']);

      return ui(props as Payload['props'], ref.ref);
    }) as any;

    Extended.extend = Component.extend;
    Extended.displayName = `WithProps(${Component.displayName})`;
    return Extended;
  };

  Component.extend = identity as any;

  return Component as PolymorphicComponent;
}
