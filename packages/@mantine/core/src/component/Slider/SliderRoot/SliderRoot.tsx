import {
  Box,
  BoxProps,
  ElementProps,
  MantineColor,
  MantineRadius,
  MantineSize,
} from '../../../core';
import { useSliderContext } from '../Slider.context';
import { JSX, splitProps } from 'solid-js';

export interface SliderRootProps extends BoxProps, ElementProps<'div'> {
  size: MantineSize | (string & {}) | number;
  children: JSX.Element;
  color: MantineColor | undefined;
  disabled: boolean | undefined;
  variant?: string;
  thumbSize: string | number | undefined;
  radius: MantineRadius | undefined;
  onMouseDownCapture?: (event: MouseEvent | TouchEvent) => void;
  onKeyDownCapture?: (event: KeyboardEvent) => void;
}

export function SliderRoot(props: SliderRootProps) {
  const [local, others] = splitProps(props, [
    'size',
    'color',
    'disabled',
    'variant',
    'thumbSize',
    'radius',
    'ref'
  ]);

  const { getStyles } = useSliderContext();

  return (
    <Box
      tabIndex={-1}
      variant={local.variant}
      size={local.size}
      ref={local.ref}
      {...getStyles('root')}
      {...others}
    />
  );
}

SliderRoot.displayName = '@mantine/core/SliderRoot';
