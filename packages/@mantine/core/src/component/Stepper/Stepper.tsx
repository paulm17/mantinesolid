import { Children, cloneElement } from 'react';
import {
  Box,
  BoxProps,
  createVarsResolver,
  ElementProps,
  factory,
  Factory,
  getAutoContrastValue,
  getContrastColor,
  getFontSize,
  getRadius,
  getSize,
  getSpacing,
  getThemeColor,
  MantineColor,
  MantineRadius,
  MantineSize,
  MantineSpacing,
  rem,
  StylesApiProps,
  useProps,
  useStyles,
} from '../../core';
import { StepperProvider } from './Stepper.context';
import { StepperCompleted } from './StepperCompleted/StepperCompleted';
import { StepperStep } from './StepperStep/StepperStep';
import classes from './Stepper.module.css';
import { children, Component, createMemo, JSX, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

export type StepFragmentComponent = Component<{ step: number }>;

export type StepperStylesNames =
  | 'root'
  | 'separator'
  | 'steps'
  | 'content'
  | 'step'
  | 'stepLoader'
  | 'verticalSeparator'
  | 'stepWrapper'
  | 'stepIcon'
  | 'stepCompletedIcon'
  | 'stepBody'
  | 'stepLabel'
  | 'stepDescription';

export type StepperCssVariables = {
  root:
    | '--stepper-color'
    | '--stepper-icon-color'
    | '--stepper-icon-size'
    | '--stepper-content-padding'
    | '--stepper-radius'
    | '--stepper-fz'
    | '--stepper-spacing';
};

export interface StepperProps
  extends BoxProps,
    StylesApiProps<StepperFactory>,
    ElementProps<'div'> {
  /** <Stepper.Step /> components */
  children: JSX.Element;

  /** Called when step is clicked */
  onStepClick?: (stepIndex: number) => void;

  /** Index of the active step */
  active: number;

  /** Step icon, default value is step index + 1 */
  icon?: JSX.Element | StepFragmentComponent;

  /** Step icon displayed when step is completed, check icon by default */
  completedIcon?: JSX.Element | StepFragmentComponent;

  /** Step icon displayed when step is in progress, default value is step index + 1 */
  progressIcon?: JSX.Element | StepFragmentComponent;

  /** Key of `theme.colors` or any valid CSS color, controls colors of active and progress steps, `theme.primaryColor` by default */
  color?: MantineColor;

  /** Controls size of the step icon, by default icon size is inferred from `size` prop */
  iconSize?: number | string;

  /** Key of `theme.spacing` or any valid CSS value to set `padding-top` of the content */
  contentPadding?: MantineSpacing;

  /** Stepper orientation, `'horizontal'` by default */
  orientation?: 'vertical' | 'horizontal';

  /** Icon position relative to the step body, `'left'` by default */
  iconPosition?: 'right' | 'left';

  /** Controls size of various Stepper elements */
  size?: MantineSize;

  /** Key of `theme.radius` or any valid CSS value to set steps border-radius, `"xl"` by default */
  radius?: MantineRadius;

  /** Determines whether next steps can be selected, `true` by default **/
  allowNextStepsSelect?: boolean;

  /** Determines whether steps should wrap to the next line if no space is available, `true` by default */
  wrap?: boolean;

  /** Determines whether icon color with filled variant should depend on `background-color`. If luminosity of the `color` prop is less than `theme.luminosityThreshold`, then `theme.white` will be used for text color, otherwise `theme.black`. Overrides `theme.autoContrast`. */
  autoContrast?: boolean;
}

export type StepperFactory = Factory<{
  props: StepperProps;
  ref: HTMLDivElement;
  stylesNames: StepperStylesNames;
  vars: StepperCssVariables;
  staticComponents: {
    Step: typeof StepperStep;
    Completed: typeof StepperCompleted;
  };
}>;

const defaultProps: Partial<StepperProps> = {
  orientation: 'horizontal',
  iconPosition: 'left',
  allowNextStepsSelect: true,
  wrap: true,
};

const varsResolver = createVarsResolver<StepperFactory>(
  (theme, { color, iconSize, size, contentPadding, radius, autoContrast }) => ({
    root: {
      '--stepper-color': color ? getThemeColor(color, theme) : undefined,
      '--stepper-icon-color': getAutoContrastValue(autoContrast, theme)
        ? getContrastColor({ color, theme, autoContrast })
        : undefined,
      '--stepper-icon-size':
        iconSize === undefined ? getSize(size, 'stepper-icon-size') : rem(iconSize),
      '--stepper-content-padding': getSpacing(contentPadding),
      '--stepper-radius': radius === undefined ? undefined : getRadius(radius),
      '--stepper-fz': getFontSize(size),
      '--stepper-spacing': getSpacing(size),
    },
  })
);

export const Stepper = factory<StepperFactory>((_props, ref) => {
  const props = useProps('Stepper', defaultProps, _props);
  const [local, others] = splitProps(props, [
    'classNames',
    'className',
    'style',
    'styles',
    'unstyled',
    'vars',
    'children',
    'onStepClick',
    'active',
    'icon',
    'completedIcon',
    'progressIcon',
    'color',
    'iconSize',
    'contentPadding',
    'orientation',
    'iconPosition',
    'size',
    'radius',
    'allowNextStepsSelect',
    'wrap',
    'autoContrast'
  ]);

  const getStyles = useStyles<StepperFactory>({
    name: 'Stepper',
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

  const resolved = children(() => props.children);
  const arr = resolved.toArray();

  const stepsArr = arr.filter(c => (c as any).type !== StepperCompleted) as unknown as Array<{ props: { children?: JSX.Element } }>;
  const completedItem = (arr.find(c => (c as any).type === StepperCompleted)
    || null) as { props: { children?: JSX.Element } } | null;

  const items = createMemo(() =>
    stepsArr.flatMap((child: any, idx: number) => {
      const state =
        local.active === idx
          ? "stepProgress"
          : local.active > idx
          ? "stepCompleted"
          : "stepInactive";

      const allowSelect =
        typeof local.onStepClick === "function" &&
        (child.props.allowStepSelect ??
          (state === "stepCompleted" || local.allowNextStepsSelect));

      // re‑render step with new props (no cloneElement)
      const stepNode = (
        <Dynamic
          component={StepperStep}
          icon={child.props.icon ?? local.icon ?? idx + 1}
          completedIcon={child.props.completedIcon ?? local.completedIcon}
          progressIcon={child.props.progressIcon ?? local.progressIcon}
          color={child.props.color ?? local.color}
          iconSize={local.iconSize}
          orientation={local.orientation}
          iconPosition={child.props.iconPosition ?? local.iconPosition}
          state={state}
          step={idx}
          allowStepClick={allowSelect}
          onClick={() => allowSelect && local.onStepClick?.(idx)}
          {...child.props}
        />
      );

      const sep =
        local.orientation === "horizontal" && idx < stepsArr.length - 1 ? (
          <div
            {...getStyles("separator")}
            data-active={idx < local.active ? "" : undefined}
            data-orientation={local.orientation}
          />
        ) : null;

      return [stepNode, sep];
    })
  );

  const content = createMemo(() => {
    if (local.active > stepsArr.length - 1) {
      return completedItem?.props.children;
    }
    return stepsArr[local.active]?.props.children;
  });

  return (
    <StepperProvider value={{ getStyles, orientation: local.orientation, iconPosition: local.iconPosition }}>
      <Box {...getStyles('root')} ref={ref} size={local.size} {...others}>
        <Box
          {...getStyles('steps')}
          mod={{
            orientation: local.orientation,
            'icon-position': local.iconPosition,
            wrap: local.wrap && local.orientation !== 'vertical',
          }}
        >
          {items()}
        </Box>
        {content && <div {...getStyles('content')}>{content()}</div>}
      </Box>
    </StepperProvider>
  );
});

Stepper.classes = classes;
Stepper.displayName = '@mantine/core/Stepper';
Stepper.Completed = StepperCompleted;
Stepper.Step = StepperStep;
