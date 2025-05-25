import { JSX, splitProps } from 'solid-js';
import { useId } from '@mantine/hooks';
import {
  Box,
  BoxProps,
  createVarsResolver,
  ElementProps,
  factory,
  Factory,
  getRadius,
  MantineColor,
  MantineRadius,
  StylesApiProps,
  useProps,
  useStyles,
} from '../../core';
import { CloseButton } from '../CloseButton';
import classes from './Alert.module.css';

export type AlertStylesNames =
  | 'root'
  | 'body'
  | 'label'
  | 'title'
  | 'icon'
  | 'wrapper'
  | 'message'
  | 'closeButton';
export type AlertVariant = 'filled' | 'light' | 'outline' | 'default' | 'transparent' | 'white';
export type AlertCssVariables = {
  root: '--alert-radius' | '--alert-bg' | '--alert-color' | '--alert-bd';
};

export interface AlertProps
  extends BoxProps,
    StylesApiProps<AlertFactory>,
    ElementProps<'div', 'title'> {
  /** Key of `theme.radius` or any valid CSS value to set border-radius, `theme.defaultRadius` by default */
  radius?: MantineRadius;

  /** Key of `theme.colors` or any valid CSS color, default value is `theme.primaryColor`  */
  color?: MantineColor;

  /** Alert title */
  title?: JSX.Element;

  /** Icon displayed next to the title */
  icon?: JSX.Element;

  /** Determines whether close button should be displayed, `false` by default */
  withCloseButton?: boolean;

  /** Called when the close button is clicked */
  onClose?: () => void;

  /** Close button `aria-label` */
  closeButtonLabel?: string;

  /** Determines whether text color with filled variant should depend on `background-color`. If luminosity of the `color` prop is less than `theme.luminosityThreshold`, then `theme.white` will be used for text color, otherwise `theme.black`. Overrides `theme.autoContrast`. */
  autoContrast?: boolean;
}

export type AlertFactory = Factory<{
  props: AlertProps;
  ref: HTMLDivElement;
  stylesNames: AlertStylesNames;
  vars: AlertCssVariables;
  variant: AlertVariant;
}>;

const defaultProps: Partial<AlertProps> = {};

const varsResolver = createVarsResolver<AlertFactory>(
  (theme, { radius, color, variant, autoContrast }) => {
    const colors = theme.variantColorResolver({
      color: color || theme.primaryColor,
      theme,
      variant: variant || 'light',
      autoContrast,
    });

    return {
      root: {
        '--alert-radius': radius === undefined ? undefined : getRadius(radius),
        '--alert-bg': color || variant ? colors.background : undefined,
        '--alert-color': colors.color,
        '--alert-bd': color || variant ? colors.border : undefined,
      },
    };
  }
);

export const Alert = factory<AlertFactory>(_props => {
  const props = useProps('Alert', defaultProps, _props);
  const [local, others] = splitProps(props, [
    'classNames',
    'className',
    'style',
    'styles',
    'unstyled',
    'vars',
    'radius',
    'color',
    'title',
    'children',
    'id',
    'icon',
    'withCloseButton',
    'onClose',
    'closeButtonLabel',
    'variant',
    'autoContrast',
    'ref'
  ]);

  const getStyles = useStyles<AlertFactory>({
    name: 'Alert',
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

  const rootId = useId(local.id);
  const titleId = (local.title && `${rootId}-title`) || undefined;
  const bodyId = `${rootId}-body`;

  return (
    <Box
      id={rootId}
      {...getStyles('root', { variant: local.variant  })}
      variant={local.variant}
      ref={local.ref}
      {...others}
      role="alert"
      aria-describedby={bodyId}
      aria-labelledby={titleId}
    >
      <div {...getStyles('wrapper')}>
        {local.icon && <div {...getStyles('icon')}>{local.icon}</div>}

        <div {...getStyles('body')}>
          {local.title && (
            <div {...getStyles('title')} data-with-close-button={local.withCloseButton || undefined}>
              <span id={titleId} {...getStyles('label')}>
                {local.title}
              </span>
            </div>
          )}

          {local.children && (
            <div id={bodyId} {...getStyles('message')} data-variant={local.variant}>
              {local.children}
            </div>
          )}
        </div>

        {local.withCloseButton && (
          <CloseButton
            {...getStyles('closeButton')}
            onClick={local.onClose}
            variant="transparent"
            size={16}
            iconSize={16}
            aria-label={local.closeButtonLabel}
            unstyled={local.unstyled}
          />
        )}
      </div>
    </Box>
  );
});

Alert.classes = classes;
Alert.displayName = '@mantine/core/Alert';
