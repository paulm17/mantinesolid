import { children, splitProps } from 'solid-js';
import { JSX } from 'solid-js/jsx-runtime';
import {
  Box,
  BoxProps,
  createVarsResolver,
  ElementProps,
  factory,
  Factory,
  getSpacing,
  isElement,
  MantineSpacing,
  StylesApiProps,
  useProps,
  useStyles,
} from '../../core';
import classes from './Breadcrumbs.module.css';

export type BreadcrumbsStylesNames = 'root' | 'separator' | 'breadcrumb';
export type BreadcrumbsCssVariables = {
  root: '--bc-separator-margin';
};

export interface BreadcrumbsProps
  extends BoxProps,
    StylesApiProps<BreadcrumbsFactory>,
    ElementProps<'div'> {
  /** Separator between children, `'/'` by default */
  separator?: JSX.Element;

  /** Controls spacing between separator and breadcrumb, `'xs'` by default */
  separatorMargin?: MantineSpacing;

  /** React nodes that should be separated with `separator` */
  children: JSX.Element;
}

export type BreadcrumbsFactory = Factory<{
  props: BreadcrumbsProps;
  ref: HTMLDivElement;
  stylesNames: BreadcrumbsStylesNames;
  vars: BreadcrumbsCssVariables;
}>;

const defaultProps: Partial<BreadcrumbsProps> = {
  separator: '/',
};

const varsResolver = createVarsResolver<BreadcrumbsFactory>((_, { separatorMargin }) => ({
  root: {
    '--bc-separator-margin': getSpacing(separatorMargin),
  },
}));

export const Breadcrumbs = factory<BreadcrumbsFactory>((_props, ref) => {
  const props = useProps('Breadcrumbs', defaultProps, _props);
  const [local, others] = splitProps(props, [
    'classNames',
    'className',
    'style',
    'styles',
    'unstyled',
    'vars',
    'children',
    'separator',
    'separatorMargin',
    'ref'
  ]);

  const getStyles = useStyles<BreadcrumbsFactory>({
    name: 'Breadcrumbs',
    classes,
    props,
    className: local.className,
    style: local.style,
    classNames: local.classNames,
    styles: local.styles,
    unstyled: local.unstyled,
    vars: local.vars,
    varsResolver,
  });

  const resolved = children(() => local.children);
  const sep = local.separator ?? "/";

  const items = () => {
    const c = resolved();
    const arr = Array.isArray(c) ? c.flat(Infinity) : [c];
    const result: JSX.Element[] = [];

    arr.forEach((child, i) => {
      result.push(
        <div class={classes.breadcrumb}>
          {child}
        </div>
      );
      if (i < arr.length - 1) {
        result.push(
          <div
            class={classes.separator}
            style={{ margin: `0 ${local.separatorMargin ?? "0"}` }}
          >
            {sep}
          </div>
        );
      }
    });

    return result;
  };

  return (
    <Box ref={ref} {...getStyles('root')} {...others}>
      {items()}
    </Box>
  );
});

Breadcrumbs.classes = classes;
Breadcrumbs.displayName = '@mantine/core/Breadcrumbs';
