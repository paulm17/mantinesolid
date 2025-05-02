import { splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { createEventHandler, isElement, useProps } from '../../../core';
import { Popover, PopoverTargetProps } from '../../Popover';
import { useHoverCardContext } from '../HoverCard.context';

export interface HoverCardTargetProps extends PopoverTargetProps {
  eventPropsWrapperName?: string;
}

const defaultProps: Partial<HoverCardTargetProps> = {
  refProp: 'ref',
};

export function HoverCardTarget(_props: HoverCardTargetProps) {
  const props = useProps('HoverCardTarget', defaultProps, _props);

  const [local, others] = splitProps(props, [
    'children',
    'refProp',
    'eventPropsWrapperName',
  ]);

  if (!isElement(local.children)) {
    throw new Error(
      'HoverCard.Target children must be a single element or component that accepts a ref'
    );
  }

  const ctx = useHoverCardContext();

  const onMouseEnter = createEventHandler(
    // @ts-ignore children.props may not be typed, but guard above ensures it's an element
    (local.children.props as any).onMouseEnter,
    ctx.openDropdown
  );
  const onMouseLeave = createEventHandler(
    // @ts-ignore children.props may not be typed, but guard above ensures it's an element
    (local.children.props as any).onMouseLeave,
    ctx.closeDropdown
  );

  const eventListeners = { onMouseEnter, onMouseLeave };

  const dynamicProps = local.eventPropsWrapperName
    ? { [local.eventPropsWrapperName]: eventListeners }
    : eventListeners;

  return (
    <Popover.Target refProp={local.refProp} {...others}>
      <Dynamic component={() => local.children} {...dynamicProps} />
    </Popover.Target>
  );
}
HoverCardTarget.displayName = '@mantine/core/HoverCardTarget';
