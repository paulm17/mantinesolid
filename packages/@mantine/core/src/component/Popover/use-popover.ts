import {
  arrow,
  flip,
  hide,
  inline,
  limitShift,
  Middleware,
  offset,
  shift,
  size,
  useFloating,
  UseFloatingReturn,
} from '@floating-ui/solid';
import { useUncontrolled } from '@mantine/hooks';
import {
  FloatingAxesOffsets,
  FloatingPosition,
  FloatingStrategy,
  useFloatingAutoUpdate,
} from '../Floating';
import { PopoverMiddlewares, PopoverWidth } from './Popover.types';
import { Accessor, createEffect, createSignal } from 'solid-js';

interface UsePopoverOptions {
  offset: number | FloatingAxesOffsets;
  position: FloatingPosition;
  positionDependencies: any[] | undefined;
  onPositionChange?: (position: FloatingPosition) => void;
  opened: Accessor<boolean | undefined>;
  defaultOpened: boolean | undefined;
  onChange?: (opened: boolean) => void;
  onClose?: () => void;
  onDismiss?: () => void;
  onOpen?: () => void;
  width: PopoverWidth;
  middlewares: PopoverMiddlewares | undefined;
  arrowRef: Accessor<HTMLElement | undefined>;
  arrowOffset: number;
  strategy?: FloatingStrategy;
}

function getDefaultMiddlewares(middlewares: PopoverMiddlewares | undefined): PopoverMiddlewares {
  if (middlewares === undefined) {
    return { shift: true, flip: true };
  }

  const result = { ...middlewares };
  if (middlewares.shift === undefined) {
    result.shift = true;
  }

  if (middlewares.flip === undefined) {
    result.flip = true;
  }

  return result;
}

function getPopoverMiddlewares(
  options: UsePopoverOptions,
  getFloating: () => UseFloatingReturn
) {
  const middlewaresOptions = getDefaultMiddlewares(options.middlewares);
  const middlewares: Middleware[] = [offset(options.offset), hide()];

  if (middlewaresOptions.shift) {
    middlewares.push(
      shift(
        typeof middlewaresOptions.shift === 'boolean'
          ? { limiter: limitShift(), padding: 5 }
          : { limiter: limitShift(), padding: 5, ...middlewaresOptions.shift }
      )
    );
  }

  if (middlewaresOptions.flip) {
    middlewares.push(
      typeof middlewaresOptions.flip === 'boolean' ? flip() : flip(middlewaresOptions.flip)
    );
  }

  if (middlewaresOptions.inline) {
    middlewares.push(
      typeof middlewaresOptions.inline === 'boolean' ? inline() : inline(middlewaresOptions.inline)
    );
  }

  const arrowElement = options.arrowRef();
  if (arrowElement) {
    middlewares.push(arrow({ element: arrowElement, padding: options.arrowOffset }));
  }

  if (middlewaresOptions.size || options.width === 'target') {
    middlewares.push(
      size({
        ...(typeof middlewaresOptions.size === 'boolean' ? {} : middlewaresOptions.size),
        // @ts-ignore
        apply({ rects, availableWidth, availableHeight, ...rest }) {
          const floating = getFloating();
          const styles = floating.elements.floating?.style ?? {};

          if (middlewaresOptions.size) {
            //If custom apply function is given use that else set defaults
            if (typeof middlewaresOptions.size === 'object' && !!middlewaresOptions.size.apply) {
              middlewaresOptions.size.apply({ rects, availableWidth, availableHeight, ...rest });
            } else {
              Object.assign(styles, {
                maxWidth: `${availableWidth}px`,
                maxHeight: `${availableHeight}px`,
              });
            }
          }

          if (options.width === 'target') {
            Object.assign(styles, {
              width: `${rects.reference.width}px`,
            });
          }
        },
      })
    );
  }

  return middlewares;
}

export function usePopover(options: UsePopoverOptions) {
  const [_opened, setOpened] = useUncontrolled({
    value: options.opened,
    defaultValue: options.defaultOpened!,
    finalValue: false,
    onChange: options.onChange,
  });

  const [referenceElement, setReferenceElement] = createSignal<HTMLElement | null>(null);
  const [floatingElement, setFloatingElement] = createSignal<HTMLElement | null>(null);
  const [previouslyOpened, setPreviouslyOpened] = createSignal(_opened());

  const onClose = () => {
    if (_opened()) {
      setOpened(false);
    }
  };

  const onToggle = () => {
    setOpened(!_opened());
  }

  const floating: UseFloatingReturn = useFloating({
    strategy: options.strategy,
    placement: options.position,
    middleware: getPopoverMiddlewares(options, () => floating),
    elements: () => ({
      reference: referenceElement(),
      floating: floatingElement()
    }),
  });

  const floatingWithRefs = {
    update: () => floating.update(),
    refs: {
      reference: () => floating.elements.reference as Element | undefined,
      floating: () => floating.elements.floating as Element | undefined,
    },
  };

  useFloatingAutoUpdate({
    opened: _opened,
    position: options.position,
    positionDependencies: options.positionDependencies || [],
    floating: floatingWithRefs,
  });

  createEffect(() => {
    options.onPositionChange?.(floating.placement);
  });

  createEffect(() => {
    if (_opened() !== previouslyOpened()) {
      if (!_opened()) {
        options.onClose?.();
      } else {
        options.onOpen?.();
      }
    }

    setPreviouslyOpened(_opened());
  });

  return {
    floating: () => floating,
    controlled: typeof options.opened() !== 'undefined',
    opened: _opened,
    onClose,
    onToggle,
    setReference: setReferenceElement,
    setFloating: setFloatingElement,
  };
}
