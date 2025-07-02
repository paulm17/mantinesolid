import { JSX, mergeProps, splitProps } from 'solid-js';
import { useMergedRef } from '@mantine/hooks';
import { factory, Factory, isElement, useProps } from '../../../core';
import { Popover } from '../../Popover';
import { useComboboxContext } from '../Combobox.context';
import { useComboboxTargetProps } from '../use-combobox-target-props/use-combobox-target-props';
import { Dynamic } from 'solid-js/web';

export interface ComboboxTargetProps {
  /** Target element */
  children: JSX.Element;

  /** Key of the prop that should be used to access element ref */
  refProp?: string;

  /** Determines whether component should respond to keyboard events, `true` by default */
  withKeyboardNavigation?: boolean;

  /** Determines whether the target should have `aria-` attributes, `true` by default */
  withAriaAttributes?: boolean;

  /** Determines whether the target should have `aria-expanded` attribute, `false` by default */
  withExpandedAttribute?: boolean;

  /** Determines which events should be handled by the target element.
   * `button` target type handles `Space` and `Enter` keys to toggle dropdown opened state.
   * `input` by default.
   * */
  targetType?: 'button' | 'input';

  /** Input autocomplete attribute */
  autoComplete?: string;
}

const defaultProps: Partial<ComboboxTargetProps> = {
  refProp: 'ref',
  targetType: 'input',
  withKeyboardNavigation: true,
  withAriaAttributes: true,
  withExpandedAttribute: false,
  autoComplete: 'off',
};

export type ComboboxTargetFactory = Factory<{
  props: ComboboxTargetProps;
  ref: HTMLElement;
  compound: true;
}>;

export const ComboboxTarget = factory<ComboboxTargetFactory>(_props => {
  const props = useProps('ComboboxTarget', defaultProps, _props);
  const [local, others] = splitProps(props, [
    'children',
    'refProp',
    'withKeyboardNavigation',
    'withAriaAttributes',
    'withExpandedAttribute',
    'targetType',
    'autoComplete',
    'ref'
  ]);

  if (!isElement(local.children)) {
    throw new Error(
      'Combobox.Target component children should be an element or a component that accepts ref. Fragments, strings, numbers and other primitive values are not supported'
    );
  }

  const ctx = useComboboxContext();

  const targetProps = useComboboxTargetProps({
    targetType: local.targetType,
    withAriaAttributes: local.withAriaAttributes,
    withKeyboardNavigation: local.withKeyboardNavigation,
    withExpandedAttribute: local.withExpandedAttribute,
    onKeyDown: typeof local.children === 'object' && local.children && 'props' in local.children
    ? (local.children.props as any).onKeyDown
    : undefined,
    autoComplete: local.autoComplete,
  });

  const mergedProps = mergeProps(targetProps, others);

  return (
    <Popover.Target ref={useMergedRef(local.ref, ctx.store.targetRef)}>
    <Dynamic
      component={() => local.children}
      {...mergedProps}
    />
  </Popover.Target>
  );
});

ComboboxTarget.displayName = '@mantine/core/ComboboxTarget';
