import { splitProps } from 'solid-js';
import {
  Box,
  BoxProps,
  ElementProps,
  factory,
  Factory,
  StylesApiProps,
  useProps,
} from '../../core';

export interface SpaceProps extends BoxProps, StylesApiProps<SpaceFactory>, ElementProps<'div'> {}

export type SpaceFactory = Factory<{
  props: SpaceProps;
  ref: HTMLDivElement;
}>;

const defaultProps: Partial<SpaceProps> = {};

export const Space = factory<SpaceFactory>((_props, ref) => {
  const props = useProps('Space', defaultProps, _props);
  const [local, others] = splitProps(props, [
    'w',
    'h',
    'miw',
    'mih'
  ]);

  return <Box ref={ref} {...others} w={local.w} miw={local.miw ?? local.w} h={local.h} mih={local.mih ?? local.h} />;
});

Space.displayName = '@mantine/core/Space';
