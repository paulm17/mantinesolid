import { mergeProps, splitProps } from 'solid-js';
import cx from 'clsx';
import { Box } from '../../../core';
import { MantineLoaderComponent } from '../Loader.types';
import classes from '../Loader.module.css';

export const Bars: MantineLoaderComponent = (props: any) => {
  const [local, others] = splitProps(props, ['className', 'ref']);

  return (
    <Box
      component="span"
      className={cx(classes.barsLoader, local.className)}
      ref={local.ref}
      {...others}
    >
      <span class={classes.bar} />
      <span class={classes.bar} />
      <span class={classes.bar} />
    </Box>
  );
};

Bars.displayName = '@mantine/core/Bars';
