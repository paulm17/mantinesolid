import { JSX, splitProps } from 'solid-js';
import { useDirection } from '../../../core';
import { ArrowPosition, FloatingPosition } from '../types';
import { getArrowPositionStyles } from './get-arrow-position-styles';

interface FloatingArrowProps extends JSX.HTMLAttributes<HTMLDivElement> {
  position: FloatingPosition;
  arrowSize: number;
  arrowOffset: number;
  arrowRadius: number;
  arrowPosition: ArrowPosition;
  arrowX: number | undefined;
  arrowY: number | undefined;
  visible: boolean | undefined;
  ref?: (element: HTMLDivElement) => void;
}

export function FloatingArrow(props: FloatingArrowProps) {
  const [local, others] = splitProps(props, [
    'position',
    'arrowSize',
    'arrowOffset',
    'arrowRadius',
    'arrowPosition',
    'visible',
    'arrowX',
    'arrowY',
    'style',
    'ref'
  ]);

  const { dir } = useDirection();

  if (!local.visible) {
    return null;
  }

  return (
    <div
      {...others}
      ref={local.ref}
      style={{
        ...(typeof local.style === 'object' && local.style !== null ? local.style : {}),
        ...getArrowPositionStyles({
          position: local.position,
          arrowSize: local.arrowSize,
          arrowOffset: local.arrowOffset,
          arrowRadius: local.arrowRadius,
          arrowPosition: local.arrowPosition,
          dir,
          arrowX: local.arrowX,
          arrowY: local.arrowY,
        }),
      }}
    />
  );
};

FloatingArrow.displayName = '@mantine/core/FloatingArrow';
