import { JSX, splitProps } from 'solid-js';
import {
  BoxProps,
  CompoundStylesApiProps,
  ElementProps,
  factory,
  Factory,
  getThemeColor,
  MantineColor,
  useMantineTheme,
  useProps,
} from '../../../core';
import { CheckIcon } from '../../Checkbox';
import { Loader } from '../../Loader';
import { Transition } from '../../Transition';
import { UnstyledButton } from '../../UnstyledButton';
import type { StepFragmentComponent } from '../Stepper';
import { useStepperContext } from '../Stepper.context';
import classes from '../Stepper.module.css';

const getStepFragment = (
  Fragment: StepFragmentComponent | JSX.Element,
  step: number | undefined
) => {
  if (typeof Fragment === 'function') {
    return <Fragment step={step || 0} />;
  }

  return Fragment;
};

export type StepperStepStylesNames =
  | 'step'
  | 'stepLoader'
  | 'verticalSeparator'
  | 'stepWrapper'
  | 'stepIcon'
  | 'stepCompletedIcon'
  | 'stepBody'
  | 'stepLabel'
  | 'stepDescription';

export interface StepperStepProps
  extends BoxProps,
    CompoundStylesApiProps<StepperStepFactory>,
    ElementProps<'button'> {
  /** Step index, controlled by Stepper component **/
  step?: number;

  /** Step state, controlled by Stepper component */
  state?: 'stepInactive' | 'stepProgress' | 'stepCompleted';

  /** Key of `theme.colors`, by default controlled by Stepper component */
  color?: MantineColor;

  /** Determines whether the icon should be displayed */
  withIcon?: boolean;

  /** Step icon, defaults to step index + 1 when rendered within Stepper */
  icon?: JSX.Element | StepFragmentComponent;

  /** Step icon displayed when step is completed */
  completedIcon?: JSX.Element | StepFragmentComponent;

  /** Step icon displayed when step is in progress */
  progressIcon?: JSX.Element | StepFragmentComponent;

  /** Step label, render after icon */
  label?: JSX.Element | StepFragmentComponent;

  /** Step description */
  description?: JSX.Element | StepFragmentComponent;

  /** Icon wrapper size */
  iconSize?: string | number;

  /** Icon position relative to step body, controlled by Stepper component */
  iconPosition?: 'right' | 'left';

  /** Indicates loading state of the step */
  loading?: boolean;

  /** Set to false to disable clicks on step */
  allowStepClick?: boolean;

  /** Should step selection be allowed */
  allowStepSelect?: boolean;

  /** Static selector base */
  __staticSelector?: string;

  /** Component orientation */
  orientation?: 'vertical' | 'horizontal';
}

export type StepperStepFactory = Factory<{
  props: StepperStepProps;
  ref: HTMLButtonElement;
  stylesNames: StepperStepStylesNames;
  compound: true;
}>;

const defaultProps: Partial<StepperStepProps> = {
  withIcon: true,
  allowStepClick: true,
  iconPosition: 'left',
};

export const StepperStep = factory<StepperStepFactory>((_props, ref) => {
  const props = useProps('StepperStep', defaultProps, _props);
  const [local, others] = splitProps(props, [
    'classNames',
    'className',
    'style',
    'styles',
    'vars',
    'step',
    'state',
    'color',
    'icon',
    'completedIcon',
    'progressIcon',
    'label',
    'description',
    'withIcon',
    'iconSize',
    'loading',
    'allowStepClick',
    'allowStepSelect',
    'iconPosition',
    'orientation',
    'mod',
    'ref'
  ]);

  const ctx = useStepperContext();
  const theme = useMantineTheme();
  const stylesApi = { classNames: local.classNames, styles: local.styles };

  const _icon = local.state === 'stepCompleted' ? null : local.state === 'stepProgress' ? local.progressIcon : local.icon;
  const dataAttributes = {
    'data-progress': local.state === 'stepProgress' || undefined,
    'data-completed': local.state === 'stepCompleted' || undefined,
  };

  return (
    <UnstyledButton
      {...ctx.getStyles('step', { className: local.className, style: local.style, variant: ctx.orientation, ...stylesApi })}
      mod={[
        { 'icon-position': local.iconPosition || ctx.iconPosition, 'allow-click': local.allowStepClick },
        local.mod,
      ]}
      ref={ref}
      {...dataAttributes}
      {...others}
      __vars={{ '--step-color': local.color ? getThemeColor(local.color, theme) : undefined }}
      tabIndex={local.allowStepClick ? 0 : -1}
    >
      {local.withIcon && (
        <span {...ctx.getStyles('stepWrapper', stylesApi)}>
          <span {...ctx.getStyles('stepIcon', stylesApi)} {...dataAttributes}>
            <Transition mounted={local.state === 'stepCompleted'} transition="pop" duration={200}>
              {(transitionStyles) => (
                <span
                  {...ctx.getStyles('stepCompletedIcon', { style: transitionStyles, ...stylesApi })}
                >
                  {local.loading ? (
                    <Loader
                      color="var(--mantine-color-white)"
                      size="calc(var(--stepper-icon-size) / 2)"
                      {...ctx.getStyles('stepLoader', stylesApi)}
                    />
                  ) : (
                    getStepFragment(local.completedIcon, local.step) || <CheckIcon size="60%" />
                  )}
                </span>
              )}
            </Transition>

            {local.state !== 'stepCompleted' ? (
              local.loading ? (
                <Loader
                  {...ctx.getStyles('stepLoader', stylesApi)}
                  size="calc(var(--stepper-icon-size) / 2)"
                  color={local.color}
                />
              ) : (
                getStepFragment(_icon || local.icon, local.step)
              )
            ) : null}
          </span>
          {local.orientation === 'vertical' && (
            <span
              {...ctx.getStyles('verticalSeparator', stylesApi)}
              data-active={local.state === 'stepCompleted' || undefined}
            />
          )}
        </span>
      )}

      {(local.label || local.description) && (
        <span
          {...ctx.getStyles('stepBody', stylesApi)}
          data-orientation={ctx.orientation}
          data-icon-position={local.iconPosition || ctx.iconPosition}
        >
          {local.label && (
            <span {...ctx.getStyles('stepLabel', stylesApi)}>{getStepFragment(local.label, local.step)}</span>
          )}
          {local.description && (
            <span {...ctx.getStyles('stepDescription', stylesApi)}>
              {getStepFragment(local.description, local.step)}
            </span>
          )}
        </span>
      )}
    </UnstyledButton>
  );
});

StepperStep.classes = classes;
StepperStep.displayName = '@mantine/core/StepperStep';
