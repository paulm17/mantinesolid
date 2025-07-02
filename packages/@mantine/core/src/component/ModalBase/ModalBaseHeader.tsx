import cx from 'clsx';
import { Box, BoxProps, ElementProps } from '../../core';
import { useModalBaseContext } from './ModalBase.context';
import classes from './ModalBase.module.css';
import { splitProps } from 'solid-js';

export interface ModalBaseHeaderProps extends BoxProps, ElementProps<'header'> {}

export function ModalBaseHeader(props: ModalBaseHeaderProps) {
  const [local, others] = splitProps(props, [
    'className',
    'ref'
  ]);
  const ctx = useModalBaseContext();
    return (
      <Box
        component="header"
        ref={local.ref}
        className={cx({ [classes.header]: !ctx.unstyled }, local.className)}
        {...others}
      />
    );
}

ModalBaseHeader.displayName = '@mantine/core/ModalBaseHeader';
