// import { createEventHandler, useProps } from '../../../core';
// import { Popover, PopoverDropdownProps } from '../../Popover';
// import { useHoverCardContext } from '../HoverCard.context';

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
    'children',
    'onMouseEnter',
    'onMouseLeave',
  ]);

  const ctx = useHoverCardContext();

  const handleMouseEnter = createEventHandler(
    local.onMouseEnter as JSX.EventHandler<HTMLDivElement, MouseEvent>,
    ctx.openDropdown
  );
  const handleMouseLeave = createEventHandler(
    local.onMouseLeave as JSX.EventHandler<HTMLDivElement, MouseEvent>,
    ctx.closeDropdown
  );

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

