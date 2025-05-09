import cx from 'clsx';
import { Box } from '../../../core';
import { MantineLoaderComponent } from '../Loader.types';
import classes from '../Loader.module.css';
import { splitProps } from 'solid-js';

export const Oval: MantineLoaderComponent = (props: any) => {
  const [local, others] = splitProps(props, ['className', 'ref']);

  return (
    <Box
      component="span"
      className={cx(classes.ovalLoader, local.className)}
      ref={local.ref}
      {...others}
    />
  );
};

Oval.displayName = '@mantine/core/Oval';
