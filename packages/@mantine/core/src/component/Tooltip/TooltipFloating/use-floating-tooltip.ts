import { createSignal, createEffect, onCleanup, createMemo } from 'solid-js';
import { getOverflowAncestors, shift, useFloating } from '@floating-ui/solid';
import { FloatingPosition } from '../../Floating';

interface UseFloatingTooltip {
  offset: number;
  position: FloatingPosition;
  defaultOpened?: boolean;
}

export function useFloatingTooltip<T extends HTMLElement = any>({
  offset,
  position,
  defaultOpened,
}: UseFloatingTooltip) {
  const [opened, setOpened] = createSignal(defaultOpened || false);
  let boundaryRef: T;
  const [floatingElement, setFloatingElement] = createSignal<HTMLElement | null>(null);
  const [referenceElement, setReferenceElement] = createSignal<any>(null);

  const { x, y, placement, update } = useFloating({
    placement: position,
    // The `elements` option now takes signals
    elements: {
      reference: referenceElement(),
      floating: floatingElement(),
    },
    middleware: [
      shift({
        crossAxis: true,
        padding: 5,
        rootBoundary: 'document',
      }),
    ],
  });

  const horizontalOffset = createMemo(() =>
    placement.includes('right') ? offset : placement.includes('left') ? offset * -1 : 0
  );

  const verticalOffset = createMemo(() =>
    placement.includes('bottom') ? offset : placement.includes('top') ? offset * -1 : 0
  );

  const handleMouseMove = ({ clientX, clientY }: MouseEvent) => {
    // Update the reference signal with a "virtual element" representing the mouse
    setReferenceElement({
      getBoundingClientRect() {
        return {
          width: 0,
          height: 0,
          x: clientX,
          y: clientY,
          left: clientX + horizontalOffset(),
          top: clientY + verticalOffset(),
          right: clientX,
          bottom: clientY,
        };
      },
    });
  };

  createEffect(() => {
    // We run the effect when the boundary and floating elements are available
    const boundary = boundaryRef;
    const floating = floatingElement();

    if (boundary && floating) {
      boundary.addEventListener('mousemove', handleMouseMove);

      // Listen for scroll events on all overflow ancestors
      const parents = getOverflowAncestors(floating);
      parents.forEach((parent) => {
        parent.addEventListener('scroll', update);
      });

      // `onCleanup` handles the removal of event listeners
      onCleanup(() => {
        boundary.removeEventListener('mousemove', handleMouseMove);
        parents.forEach((parent) => {
          parent.removeEventListener('scroll', update);
        });
      });
    }
  });

  return {
    x,
    y,
    opened,
    setOpened,
    boundaryRef: (el: T) => (boundaryRef = el),
    floating: setFloatingElement,
    handleMouseMove,
  };
}
