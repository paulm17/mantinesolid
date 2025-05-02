import { mergeProps, splitProps } from 'solid-js';
import cx from 'clsx';
import { Box } from '../../../core';
import { MantineLoaderComponent } from '../Loader.types';
import classes from '../Loader.module.css';

export const Dots: MantineLoaderComponent = (props: any) => {
  const [local, others] = splitProps(props, ['className', 'ref']);

  return (
    <Box
      component="span"
      className={cx(classes.dotsLoader, local.className)}
      ref={local.ref}
      {...others}
    >
      <span class={classes.dot} />
      <span class={classes.dot} />
      <span class={classes.dot} />
    </Box>
  );
};

Dots.displayName = '@mantine/core/Dots';
