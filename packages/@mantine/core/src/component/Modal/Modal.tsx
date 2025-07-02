import { createEffect, JSX, splitProps } from 'solid-js';
import { factory, Factory, getDefaultZIndex, useProps } from '../../core';
import { ModalBaseCloseButtonProps, ModalBaseOverlayProps } from '../ModalBase';
import { ModalBody } from './ModalBody';
import { ModalCloseButton } from './ModalCloseButton';
import { ModalContent } from './ModalContent';
import { ModalHeader } from './ModalHeader';
import { ModalOverlay } from './ModalOverlay';
import {
  ModalRoot,
  ModalRootCssVariables,
  ModalRootProps,
  ModalRootStylesNames,
} from './ModalRoot';
import { ModalStack, useModalStackContext } from './ModalStack';
import { ModalTitle } from './ModalTitle';
import classes from './Modal.module.css';

export type ModalStylesNames = ModalRootStylesNames;
export type ModalCssVariables = ModalRootCssVariables;

export interface ModalProps extends ModalRootProps {
  __staticSelector?: string;

  /** Modal title */
  title?: JSX.Element;

  /** Determines whether the overlay should be rendered, `true` by default */
  withOverlay?: boolean;

  /** Props passed down to the `Overlay` component, use to configure opacity, `background-color`, styles and other properties */
  overlayProps?: ModalBaseOverlayProps;

  /** Modal content */
  children?: JSX.Element;

  /** Determines whether the close button should be rendered, `true` by default */
  withCloseButton?: boolean;

  /** Props passed down to the close button */
  closeButtonProps?: ModalBaseCloseButtonProps;

  /** Id of the modal in the `Modal.Stack` */
  stackId?: string;
}

export type ModalFactory = Factory<{
  props: ModalProps;
  ref: HTMLDivElement;
  stylesNames: ModalStylesNames;
  vars: ModalCssVariables;
  staticComponents: {
    Root: typeof ModalRoot;
    Overlay: typeof ModalOverlay;
    Content: typeof ModalContent;
    Body: typeof ModalBody;
    Header: typeof ModalHeader;
    Title: typeof ModalTitle;
    CloseButton: typeof ModalCloseButton;
    Stack: typeof ModalStack;
  };
}>;

const defaultProps: Partial<ModalProps> = {
  closeOnClickOutside: true,
  withinPortal: true,
  lockScroll: true,
  trapFocus: true,
  returnFocus: true,
  closeOnEscape: true,
  keepMounted: false,
  zIndex: getDefaultZIndex('modal'),
  transitionProps: { duration: 200, transition: 'fade-down' },
  withOverlay: true,
  withCloseButton: true,
};

export const Modal = factory<ModalFactory>(_props => {
  const [local, others] = splitProps(_props, [
    'title',
    'withOverlay',
    'overlayProps',
    'withCloseButton',
    'closeButtonProps',
    'children',
    'radius',
    'opened',
    'stackId',
    'zIndex',
    'ref'
  ]);

  const ctx = useModalStackContext();
  const hasHeader = !!local.title || local.withCloseButton;
  const stackProps =
    ctx && local.stackId
      ? {
          closeOnEscape: ctx.currentId === local.stackId,
          trapFocus: ctx.currentId === local.stackId,
          zIndex: ctx.getZIndex(local.stackId),
        }
      : {};

  const overlayVisible =
    local.withOverlay === false ? false : local.stackId && ctx ? ctx.currentId === local.stackId : local.opened();

  createEffect(() => {
    if (ctx && local.stackId) {
      local.opened()
        ? ctx.addModal(local.stackId, local.zIndex || getDefaultZIndex('modal'))
        : ctx.removeModal(local.stackId);
    }
  });

  return (
    <ModalRoot
      ref={local.ref}
      radius={local.radius}
      opened={local.opened}
      zIndex={ctx && local.stackId ? ctx.getZIndex(local.stackId) : local.zIndex}
      {...others}
      {...stackProps}
    >
      {local.withOverlay && (
        <ModalOverlay
          visible={overlayVisible}
          transitionProps={ctx && local.stackId ? { duration: 0 } : undefined}
          {...local.overlayProps}
        />
      )}
      <ModalContent
        radius={local.radius}
        __hidden={ctx && local.stackId && local.opened() ? local.stackId !== ctx.currentId : false}
      >
        {hasHeader && (
          <ModalHeader>
            {local.title && <ModalTitle>{local.title}</ModalTitle>}
            {local.withCloseButton && <ModalCloseButton {...local.closeButtonProps} />}
          </ModalHeader>
        )}

        <ModalBody>{local.children}</ModalBody>
      </ModalContent>
    </ModalRoot>
  );
});

Modal.classes = classes;
Modal.displayName = '@mantine/core/Modal';
Modal.Root = ModalRoot;
Modal.Overlay = ModalOverlay;
Modal.Content = ModalContent;
Modal.Body = ModalBody;
Modal.Header = ModalHeader;
Modal.Title = ModalTitle;
Modal.CloseButton = ModalCloseButton;
Modal.Stack = ModalStack;
