import { JSX, splitProps } from 'solid-js';
import { createEventHandler, useProps } from '../../../core';
import { Popover, PopoverDropdownProps } from '../../Popover';
import { useHoverCardContext } from '../HoverCard.context';

export interface HoverCardDropdownProps extends PopoverDropdownProps {
  /** Dropdown content */
  children?: JSX.Element;
}

// keep your defaults object
const defaultProps: Partial<HoverCardDropdownProps> = {};

export function HoverCardDropdown(_props: HoverCardDropdownProps) {
  // merge defaultProps first, then incoming props
  const props = useProps('HoverCardDropdown', defaultProps, _props);

  // split off the bits we need locally; `others` will contain the rest
  const [local, others] = splitProps(props, [
    'onMouseEnter',
    'onMouseLeave',
    'children',
  ]);

  const ctx = useHoverCardContext();

  const handleMouseEnter = createEventHandler<any>(local.onMouseEnter, ctx.openDropdown);
  const handleMouseLeave = createEventHandler<any>(local.onMouseLeave!, ctx.closeDropdown);

  return (
    <Popover.Dropdown
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...others}
    >
      {local.children}
    </Popover.Dropdown>
  );
}

HoverCardDropdown.displayName = '@mantine/core/HoverCardDropdown';

