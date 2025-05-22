import { JSX, splitProps } from 'solid-js';
import {
  CompoundStylesApiProps,
  createScopedKeydownHandler,
  ElementProps,
  factory,
  Factory,
  getThemeColor,
  MantineColor,
  useDirection,
  useMantineTheme,
  useProps,
} from '../../../core';
import { UnstyledButton, UnstyledButtonProps } from '../../UnstyledButton';
import { useTabsContext } from '../Tabs.context';
import classes from '../Tabs.module.css';

export type TabsTabStylesNames = 'tab' | 'tabSection' | 'tabLabel';

export interface TabsTabProps
  extends Omit<UnstyledButtonProps, 'classNames' | 'styles' | 'vars'>,
    CompoundStylesApiProps<TabsTabFactory>,
    ElementProps<'button'> {
  /** Value of associated panel */
  value: string;

  /** Tab label */
  children?: JSX.Element;

  /** Content displayed on the right side of the label, for example, icon */
  rightSection?: JSX.Element;

  /** Content displayed on the left side of the label, for example, icon */
  leftSection?: JSX.Element;

  /** Key of `theme.colors` or any valid CSS color, controls control color based on `variant` */
  color?: MantineColor;
}

export type TabsTabFactory = Factory<{
  props: TabsTabProps;
  ref: HTMLButtonElement;
  stylesNames: TabsTabStylesNames;
  compound: true;
}>;

const defaultProps: Partial<TabsTabProps> = {};

export const TabsTab = factory<TabsTabFactory>((_props, ref) => {
  const props = useProps('TabsTab', defaultProps, _props);
  const [local, others] = splitProps(props, [
    'className',
    'children',
    'rightSection',
    'leftSection',
    'value',
    'onClick',
    'onKeyDown',
    'disabled',
    'color',
    'style',
    'classNames',
    'styles',
    'vars',
    'mod',
    'tabIndex',
  ]);

  const theme = useMantineTheme();
  const { dir } = useDirection();
  const ctx = useTabsContext();
  const active = local.value === ctx.value;
  const activateTab = (event: MouseEvent & { currentTarget: HTMLButtonElement; target: Element }) => {
    ctx.onChange(ctx.allowTabDeactivation ? (local.value === ctx.value ? null : local.value) : local.value);
    typeof local.onClick === "function" && local.onClick?.(event);
  };

  const stylesApiProps = { classNames: local.classNames, styles: local.styles, props };

  return (
    <UnstyledButton
      {...others}
      {...ctx.getStyles('tab', { className: local.className, style: local.style, variant: ctx.variant, ...stylesApiProps })}
      disabled={local.disabled}
      unstyled={ctx.unstyled}
      variant={ctx.variant}
      mod={[
        {
          active,
          disabled: local.disabled,
          orientation: ctx.orientation,
          inverted: ctx.inverted,
          placement: ctx.orientation === 'vertical' && ctx.placement,
        },
        local.mod,
      ]}
      ref={ref}
      role="tab"
      id={ctx.getTabId(local.value)}
      aria-selected={active}
      tabIndex={local.tabIndex !== undefined ? local.tabIndex : active || ctx.value === null ? 0 : -1}
      aria-controls={ctx.getPanelId(local.value)}
      onClick={activateTab}
      __vars={{ '--tabs-color': local.color ? getThemeColor(local.color, theme) : undefined }}
      onKeyDown={createScopedKeydownHandler({
        siblingSelector: '[role="tab"]',
        parentSelector: '[role="tablist"]',
        activateOnFocus: ctx.activateTabWithKeyboard,
        loop: ctx.loop,
        orientation: ctx.orientation || 'horizontal',
        dir,
        onKeyDown: local.onKeyDown as ((event: KeyboardEvent) => void) | undefined,
      })}
    >
      {local.leftSection && (
        <span {...ctx.getStyles('tabSection', stylesApiProps)} data-position="left">
          {local.leftSection}
        </span>
      )}
      {local.children && <span {...ctx.getStyles('tabLabel', stylesApiProps)}>{local.children}</span>}
      {local.rightSection && (
        <span {...ctx.getStyles('tabSection', stylesApiProps)} data-position="right">
          {local.rightSection}
        </span>
      )}
    </UnstyledButton>
  );
});

TabsTab.classes = classes;
TabsTab.displayName = '@mantine/core/TabsTab';
