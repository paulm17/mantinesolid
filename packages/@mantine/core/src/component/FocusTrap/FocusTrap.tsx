import { Show, splitProps, type Component, type JSX, type Ref as SolidRef } from 'solid-js';
import { useFocusTrap, useMergedRef } from '@mantine/hooks';

export interface FocusTrapProps {
  children: (props: { ref: SolidRef<any> }) => JSX.Element;
  active?: boolean;
  innerRef?: SolidRef<any>;
}

export const FocusTrap: Component<FocusTrapProps> = (props) => {
  const [local] = splitProps(props, ['children', 'active', 'innerRef']);

  const focusTrapRef = useFocusTrap(() => local.active ?? false);
  const combinedRef = useMergedRef(focusTrapRef, local.innerRef as any);

  return (
    <Show when={local.active}>
      {local.children({ ref: combinedRef })}
    </Show>
  );
};
